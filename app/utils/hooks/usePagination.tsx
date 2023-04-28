import { useMemo } from "react"

const range = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
}

export const ELLIPSIS = -1

/**
 * @param {object} UsePaginationProps
 * @param {number} [UsePaginationProps.boundaryCount=1] - Number of always visible pages at the beginning and end.
 * @param {number} [UsePaginationProps.count=1] - The total number of pages.
 * @param {number} [UsePaginationProps.page=1] - The current page.
 * @param {number} [UsePaginationProps.siblingCount=1] - Number of always visible pages before and after the current page.
 */
const usePagination = ({
  boundaryCount = 1,
  count = 1,
  page = 1,
  siblingCount = 1,
}) => {
  const preparedPages = useMemo(() => {
    const startPages = range(1, Math.min(boundaryCount, count))
    const endPages = range(
      Math.max(count - boundaryCount + 1, boundaryCount + 1),
      count,
    )

    const siblingsStart = Math.max(
      Math.min(
        // Natural start
        page - siblingCount,
        // Lower boundary when page is high
        count - boundaryCount - siblingCount * 2 - 1,
      ),
      // Greater than startPages
      boundaryCount + 2,
    )

    const siblingsEnd = Math.min(
      Math.max(
        // Natural end
        page + siblingCount,
        // Upper boundary when page is low
        boundaryCount + siblingCount * 2 + 2,
      ),
      // Less than endPages
      endPages.length > 0 ? endPages[0] - 2 : count - 1,
    )

    const pages = [...startPages]

    if (siblingsStart > boundaryCount + 2) {
      pages.push(ELLIPSIS)
    } else if (boundaryCount + 1 < count - boundaryCount) {
      pages.push(boundaryCount + 1)
    }

    pages.push(...range(siblingsStart, siblingsEnd))

    if (siblingsEnd < count - boundaryCount - 1) {
      pages.push(ELLIPSIS)
    } else if (count - boundaryCount > boundaryCount) {
      pages.push(count - boundaryCount)
    }

    pages.push(...endPages)

    return pages.map((item, i) => ({
      key: item === ELLIPSIS ? ELLIPSIS * i : item,
      page: item,
      isEllipses: item === ELLIPSIS,
    }))
  }, [boundaryCount, count, page, siblingCount])

  return preparedPages
}

export default usePagination
