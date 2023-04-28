import type { FC, ReactNode } from "react"

interface SearchLayoutProps {
  children?: ReactNode
}

export const SearchLayout: FC<SearchLayoutProps> = ({ children }) => {
  return (
    <div className="mx-4 sm:mx-0">
      <div className="max-w-[640px] w-full flex flex-col flex-1 mx-auto">
        {children}
      </div>
    </div>
  )
}
