import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import type { ShouldRevalidateFunction } from "@remix-run/react"
import { useLoaderData, useSearchParams } from "@remix-run/react"

import { Package } from "~/components/Package"
import { Packages } from "~/components/Packages"
import { Pagination } from "~/components/Pagination"
import { SearchForm } from "~/components/SearchForm"
import { SearchLayout } from "~/components/layouts/SearchLayout"

import { md5 } from "~/utils/hash.server"
import { getSearchResults } from "~/api/search"
import { searchPerPageSize as size } from "~/shared/general"
import type { SearchResponse, TransformedPackageType } from "~/utils/types"

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formAction,
  defaultShouldRevalidate,
}) => {
  if (formAction === "/change-theme") return false
  return defaultShouldRevalidate
}

export const loader = async ({ request }: LoaderArgs) => {
  const { searchParams } = new URL(request.url)

  const newSearchParams = new URLSearchParams()

  newSearchParams.set("size", size.toString())

  const q = searchParams.get("q")

  let randomPackageName = "react"

  if (!q) {
    return json({
      randomPackageName,
      packages: [],
      meta: {
        page: 0,
        totalPages: 0,
        totalPackages: 0,
        isFirst: false,
        isLast: false,
      },
    })
  }

  newSearchParams.set("text", q)

  const page = searchParams.get("page")

  let pageAsNumber = 0

  if (page) {
    pageAsNumber = Number.parseInt(page, 10)
    if (Number.isInteger(pageAsNumber)) {
      newSearchParams.set(
        "from",
        (Math.max(0, pageAsNumber - 1) * size).toString(),
      )
    }
  }

  const res = await getSearchResults(newSearchParams)

  if (res.status !== 200) {
    console.error(await res.clone().text())
    throw new Error("Something went wrong")
  }

  const parsedResponse: SearchResponse = await res.json()

  const packages: TransformedPackageType[] = parsedResponse.objects.map(
    ({ package: pkg }) => {
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
    },
  )

  if (packages.length > 0) {
    const randomPackage = packages.at(
      Math.floor(Math.random() * packages.length),
    )

    randomPackageName = randomPackage?.name as string
  }

  const finalPage = Math.max(1, pageAsNumber)
  const finalTotal = Math.round(parsedResponse.total / size)

  return json({
    packages,
    randomPackageName,
    meta: {
      page: finalPage,
      totalPages: finalTotal,
      totalPackages: parsedResponse.total,
      isFirst: finalPage === 1,
      isLast: finalPage === finalTotal,
    },
  })
}

export default function Index() {
  const [searchParams] = useSearchParams()
  const loaderData = useLoaderData<typeof loader>()

  const currentQuery = searchParams.get("q")

  return (
    // use nice here patterns
    // see npm.io
    <SearchLayout>
      <SearchForm
        placeholder={loaderData.randomPackageName}
        // We might need to take into consideration others params as well
        // maybe use sp.size?
        isSmall={currentQuery !== null && currentQuery.trim().length !== 0}
      />
      <Packages shown={loaderData?.packages?.length > 0}>
        {loaderData.packages.map(
          ({ name, description, keywords, publisher, version, date }) => {
            return (
              <Package
                key={name}
                name={name}
                description={description}
                keywords={keywords}
                publisher={publisher}
                version={version}
                date={date}
                isExactMatch={currentQuery === name}
              />
            )
          },
        )}
      </Packages>
      {Array.isArray(loaderData?.packages) && (
        <Pagination
          isLast={loaderData.meta.isLast}
          isFirst={loaderData.meta.isFirst}
          pageNumber={loaderData.meta.page}
          totalPages={loaderData.meta.totalPages}
          shown={loaderData.meta.totalPages > size}
        />
      )}
    </SearchLayout>
  )
}
