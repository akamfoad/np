import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/node"

import { Package } from "~/components/Package"
import { Packages } from "~/components/Packages"
import { Pagination } from "~/components/Pagination"
import { SearchForm } from "~/components/SearchForm"
import { SearchLayout } from "~/components/layouts/SearchLayout"

import { md5 } from "~/utils/hash.server"
import { getSearchResults } from "~/api/search"
import { searchPerPageSize as size } from "~/shared/general"
import type { SearchResponse, TransformedPackageType } from "~/utils/types"

export const loader = async ({ request, params }: LoaderArgs) => {
  const { searchParams } = new URL(request.url)

  const newSearchParams = new URLSearchParams()

  newSearchParams.set("size", size.toString())

  const q = searchParams.get("q")

  const textSearch = `maintainer:${params.username} ${q ? q : ""}`.trimEnd()

  newSearchParams.set("text", textSearch)

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

  let randomPackageName = "react"

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

export default function UserProfile() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <SearchLayout>
      <SearchForm placeholder={loaderData.randomPackageName} />
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
          shown={loaderData.meta.totalPackages > size}
        />
      )}
    </SearchLayout>
  )
}
