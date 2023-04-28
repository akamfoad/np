import type { FC, ReactNode } from "react"

interface KeywordsProps {
  children?: ReactNode
}

export const Keywords: FC<KeywordsProps> = ({ children }) => {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-0.5 sm:gap-x-3 sm:gap-y-2 my-2">
      {children}
    </div>
  )
}
