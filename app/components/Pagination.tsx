import classNames from "classnames"
import { Link, useLocation } from "@remix-run/react"
import ArrowRightIcon from "@heroicons/react/24/solid/ChevronDoubleRightIcon"
import ArrowLeftIcon from "@heroicons/react/24/solid/ChevronDoubleLeftIcon"

import usePagination from "~/utils/hooks/usePagination"

export const Pagination = ({
  pageNumber = 1,
  totalPages = 1,
  isFirst = false,
  isLast = false,
  shown = false,
}) => {
  const { pathname, search } = useLocation()

  const generateUrlPath = (pageIndex: number) => {
    const newSearchParams = new URLSearchParams(search)
    newSearchParams.set("page", pageIndex.toString())

    return `${pathname}?${newSearchParams}`
  }

  const pages = usePagination({
    count: totalPages,
    page: pageNumber,
  })

  return (
    <div className="my-4">
      <div
        className={classNames(
          "flex items-center gap-x-2 gap-y-1 transition-opacity",
          {
            "opacity-100 duration-200 delay-300": shown,
            "opacity-0 duration-0 pointer-events-none": !shown,
          },
        )}
      >
        <Link
          to={generateUrlPath(1)}
          className={classNames(
            "p-2 rounded min-w-[2rem] h-8 flex items-center justify-center font-medium",
            "transition-colors duration-200 ease-in-out",
            "hover:bg-lime-50 active:bg-lime-100",
            "border-2 border-lime-500 text-lime-950",
            { "opacity-50": isFirst },
          )}
          aria-disabled={isFirst}
          aria-label="Go to first page"
          tabIndex={isFirst ? -1 : undefined}
        >
          <ArrowLeftIcon width={16} height={16} />
        </Link>
        {pages.map(({ key, page, isEllipses }) => {
          if (isEllipses)
            return (
              <button
                disabled
                key={key}
                type="button"
                className={classNames(
                  "p-2 rounded min-w-[2rem] h-8 flex items-center justify-center font-medium",
                  "text-lime-950",
                )}
              >
                ...
              </button>
            )

          return (
            <Link
              key={key}
              to={generateUrlPath(page)}
              className={classNames(
                "p-2 rounded min-w-[2rem] h-8 flex items-center justify-center font-medium",
                "transition-colors duration-200 ease-in-out",
                "border-2 text-lime-950",
                {
                  "bg-lime-300 shadow-lg border-transparent":
                    pageNumber === page,
                  "hover:bg-lime-50 active:bg-lime-100 border-lime-500":
                    pageNumber !== page,
                },
              )}
              aria-current={pageNumber === page ? "page" : "false"}
              tabIndex={pageNumber === page ? -1 : undefined}
            >
              {page}
            </Link>
          )
        })}
        <Link
          to={generateUrlPath(totalPages)}
          className={classNames(
            "p-2 rounded min-w-[2rem] h-8 flex items-center justify-center font-medium",
            "transition-colors duration-200 ease-in-out",
            "hover:bg-lime-50 active:bg-lime-100",
            "border-2 border-lime-500 text-lime-950",
            { "opacity-50": isLast },
          )}
          aria-disabled={isLast}
          aria-label="Go to last page"
          tabIndex={isLast ? -1 : undefined}
        >
          <ArrowRightIcon width={16} height={16} />
        </Link>
      </div>
    </div>
  )
}
