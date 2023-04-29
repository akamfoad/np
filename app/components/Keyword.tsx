import type { FC } from "react"
import classNames from "classnames"
import { useSearchParams } from "@remix-run/react"

import { matchesCurrentKeyword } from "~/utils/search"

interface KeywordProps {
  text: string
}

export const Keyword: FC<KeywordProps> = ({ text }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isActive = matchesCurrentKeyword(searchParams, text)
  return (
    <button
      className={classNames(
        "px-1.5 py-1 text-xs sm:text-sm font-medium rounded leading-3",
        "transition-colors duration-200 ease-out border border-transparent",
        {
          "bg-amber-100 text-amber-950 dark:bg-amber-700/20 dark:text-amber-100 dark:border-amber-200/30":
            isActive,
          "bg-slate-200 text-slate-900 dark:bg-transparent dark:text-lime-100 dark:border-lime-500/50":
            !isActive,
        },
      )}
      onClick={() => {
        const newSearchParams = new URLSearchParams(searchParams)

        if (isActive) newSearchParams.delete("q")
        else newSearchParams.set("q", `keywords:${text}`)

        setSearchParams(newSearchParams)
      }}
    >
      {text}
    </button>
  )
}
