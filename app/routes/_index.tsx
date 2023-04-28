import dayjs from "dayjs"
import { json } from "@remix-run/node"
import * as Avatar from "@radix-ui/react-avatar"
import { cacheHeader } from "pretty-cache-header"
import relativeTime from "dayjs/plugin/relativeTime"
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon"
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react"

import { md5 } from "~/utils/hash.server"
import classNames from "classnames"
import { useMemo } from "react"

dayjs.extend(relativeTime)

export const meta: V2_MetaFunction = () => {
  return [{ title: "bpm.io" }]
}

export const loader = async ({ request }: LoaderArgs) => {
  const { searchParams } = new URL(request.url)

  searchParams.set("size", "1")

  const q = searchParams.get("q")
  if (q) {
    searchParams.set("text", q)
    searchParams.delete("q")
  }

  const res = await fetch(
    `https://registry.npmjs.org/-/v1/search?${searchParams.toString()}`,
  )
  const parsedResponse = (await res.json()) as {
    objects: [
      {
        package: {
          name: string
          description: string
          keywords?: string[]
          publisher: {
            username: string
            email: string
          }
          version: string
          date: string
        }
      },
    ]
  }

  return json(
    {
      packages: parsedResponse.objects.map(({ package: pkg }) => {
        let usernameWords = pkg.publisher.username.split(" ").slice(0, 2)
        if (usernameWords.length === 1) {
          usernameWords = usernameWords.map((word) => word.slice(0, 2))
        } else {
          usernameWords = usernameWords.map((word) => word.charAt(0))
        }

        return {
          ...pkg,
          publisher: {
            ...pkg.publisher,
            gravatarId: md5(pkg.publisher.email),
            initials: usernameWords.join(""),
          },
        }
      }),
    },
    {
      headers: {
        "Cache-Control": cacheHeader({
          maxAge: "1week",
          public: true,
          staleWhileRevalidate: "1month",
          mustRevalidate: true,
          sMaxage: "3month",
        }),
      },
    },
  )
}

export default function Index() {
  const [searchParams] = useSearchParams()
  const loaderData = useLoaderData<typeof loader>()

  const noSearchYet = useMemo(() => {
    // We might need to take into consideration others params as well
    // maybe use sp.size?
    const q = searchParams.get("q")
    return !q || q.trim().length === 0
  }, [searchParams])

  const searchPlaceholder = useMemo(() => {
    if (loaderData.packages.length === 0) return "react"

    const randomPackage = loaderData.packages.at(
      Math.floor(Math.random() * loaderData.packages.length),
    )

    return randomPackage?.name
  }, [loaderData.packages])

  return (
    // use nice here patterns
    // see npm.io
    <div className="max-w-[640px] w-full flex flex-col flex-1 mx-auto">
      <div
        className={classNames(
          "flex flex-col gap-20 justify-center transition-all",
          {
            "translate-y-full duration-400 ease-linear": noSearchYet,
            "translate-y-0 duration-200 ease-out": !noSearchYet,
          },
        )}
      >
        <div
          className={classNames({
            // "-mt-32": noSearchYet,
          })}
        >
          <h1 className="text-7xl font-black text-center">bpm.io</h1>
        </div>
        <Form
          className={classNames(
            "flex rounded-l-lg rounded-r-lg items-stretch h-12 shadow-md",
            "focus-within:shadow-lg",
          )}
        >
          <input
            className={classNames(
              "rounded-md w-full rounded-l-lg rounded-r-none focus:outline-none p-4 text-base",
              "leading-loose",
            )}
            type="search"
            aria-label="Search"
            name="q"
            autoFocus
            defaultValue={searchParams.get("q") || undefined}
            placeholder={searchPlaceholder}
          />
          <button
            type="submit"
            aria-label="Search"
            className={classNames(
              "hover:bg-lime-500/80 active:bg-lime-600",
              "bg-lime-500 text-white ring-2 ring-transparent",
              "aspect-square flex items-center justify-center rounded-r-lg rounded-l-none",
              "focus:outline-none focus:ring-lime-700",
            )}
          >
            <MagnifyingGlassIcon width="24" height="24" />
          </button>
        </Form>
      </div>
      <div
        className={classNames(
          "flex flex-col gap-4 transition-opacity duration-100 delay-300 ease-in",
          {
            "p-4 opacity-1": loaderData?.packages?.length > 0,
            "opacity-0": !loaderData?.packages?.length,
          },
        )}
      >
        {loaderData.packages.map(
          ({ name, description, keywords, publisher, version, date }) => {
            return (
              <section
                key={name}
                className="flex flex-col bg-slate-50 rounded-xl px-3 py-2"
              >
                <h2 className="flex flex-wrap gap-1.5 text-lg font-medium">
                  <Link
                    className="flex items-center"
                    to={`/publisher/${publisher.username}`}
                  >
                    <Avatar.Root className="inline-block min-w-[1.75rem] min-h-[1.75rem] w-7 h-7">
                      <Avatar.Image
                        src={`https://www.gravatar.com/avatar/${publisher.gravatarId}?s=40`}
                        alt={name}
                        width="28px"
                        height="28px"
                        className="inline-flex rounded-full"
                      />
                      <Avatar.Fallback className="rounded-full min-w-[1.75rem] min-h-[1.75rem] w-7 h-7 inline-flex justify-center items-center bg-slate-50">
                        {publisher.initials}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <span className="self-stretch ml-1.5">
                      {publisher.username}
                    </span>
                  </Link>
                  <span className="select-none">/</span>
                  <Link to={`/package/${publisher.username}`}>{name}</Link>
                  {/* TODO use heroicons here */}
                  {/* {searchParams.get("text")?.toLowerCase() === name && (
                    <span>✨</span>
                  )} */}
                </h2>
                <p className="mt-2.5 text-slate-700">{description}</p>

                {Array.isArray(keywords) && (
                  <div className="flex flex-wrap gap-4 my-2">
                    {keywords?.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-1.5 py-1 text-sm bg-slate-200 rounded leading-3"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-xs text-slate-600 tracking-wide">
                  {version} <span className="inline-block mx-1">•</span>{" "}
                  Published {dayjs(date).fromNow()}
                </p>
              </section>
            )
          },
        )}
      </div>
    </div>
  )
}
