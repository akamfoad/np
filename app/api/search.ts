import { buildURL } from "./config"

export const getSearchResults = (searchParams: URLSearchParams) => {
  return fetch(buildURL(`/-/v1/search?${searchParams.toString()}`))
}
