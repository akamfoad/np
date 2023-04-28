import classNames from "classnames"
import type { FC, ReactNode } from "react"

interface KeywordsProps {
  children?: ReactNode
  shown: boolean
}

export const Packages: FC<KeywordsProps> = ({ children, shown }) => {
  return (
    <div
      className={classNames(
        "flex flex-col gap-4 sm:gap-8 transition-opacity duration-100 delay-300 ease-in",
        {
          "py-8 opacity-1": shown,
          "opacity-0": !shown,
        },
      )}
    >
      {children}
    </div>
  )
}
