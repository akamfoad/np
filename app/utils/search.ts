export const matchesCurrentKeyword = (
  searchParams: URLSearchParams,
  keyword: string,
): boolean => {
  const currentQuery = searchParams.get("q")
  if (!currentQuery || !currentQuery.includes("keywords")) return false

  const currentKeyword = currentQuery.trim().split(":").pop()

  return currentKeyword?.toLowerCase() === keyword.toLowerCase()
}
