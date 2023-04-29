import { useRef } from "react"
import type { FC } from "react"
import classNames from "classnames"
import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react"
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon"

interface SearchFormProps {
  placeholder: string
  isSmall?: boolean
}

export const SearchForm: FC<SearchFormProps> = ({
  placeholder,
  isSmall = true,
}) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const navigation = useNavigation()
  const [searchParams] = useSearchParams()

  const currentQuery = searchParams.get("q")

  return (
    <div
      className={classNames(
        "flex flex-col justify-center transition-all mt-8",
        {
          "translate-y-[140%] sm:translate-y-full duration-400 ease-linear gap-14 sm:gap-20":
            !isSmall,
          "translate-y-0 duration-200 ease-out gap-4": isSmall,
        },
      )}
    >
      <div>
        <h1
          className={classNames(
            "transition-all ease-in font-black text-center dark:text-lime-500",
            {
              "text-4xl sm:text-7xl duration-100": !isSmall,
              "text-2xl sm:text-4xl duration-200": isSmall,
            },
          )}
        >
          <Link to="/">Node Packages</Link>
        </h1>
      </div>
      <Form
        className={classNames(
          "flex rounded-l-lg rounded-r-lg items-stretch h-10 sm:h-14 shadow-md",
          "focus-within:shadow-lg transition-shadow duration-200 ease-out",
        )}
        onSubmit={() => {
          searchInputRef.current?.blur()
        }}
        action="/?index"
      >
        <input
          ref={searchInputRef}
          key={currentQuery}
          className={classNames(
            "appearance-none rounded-md w-full rounded-l-lg rounded-r-none focus:outline-none px-3 sm:px-6 text-base sm:text-lg",
            "leading-loose bg-slate-50 dark:bg-slate-950 dark:placeholder:text-slate-400",
          )}
          type="search"
          aria-label="Search"
          name="q"
          autoFocus
          defaultValue={currentQuery || undefined}
          placeholder={placeholder}
          autoCapitalize="off"
        />
        <button
          type="submit"
          aria-label="Search"
          className={classNames(
            "transition-colors duration-200 ease-in-out",
            "disabled:bg-lime-500/50",
            "hover:bg-lime-500/80 active:bg-lime-600 dark:active:bg-lime-600",
            "bg-lime-500 text-white dark:bg-lime-600 ring-2 ring-transparent",
            "aspect-square h-full flex items-center justify-center rounded-r-lg rounded-l-none",
            "focus:outline-none focus:ring-lime-700",
          )}
          disabled={navigation.state === "loading"}
        >
          <MagnifyingGlassIcon width="24" height="24" />
        </button>
      </Form>
      <p
        className={classNames(
          "text-zinc-800 dark:text-lime-500 absolute -bottom-20 pointer-events-none transition-opacity",
          {
            "opacity-0 duration-0": isSmall,
            "opacity-100 duration-500 delay-500": !isSmall,
          },
        )}
      >
        Type{" "}
        <kbd className="font-black border border-slate-700 dark:border-lime-700 px-2 py-1 rounded-md">
          d
        </kbd>{" "}
        or{" "}
        <kbd className="font-black border border-slate-700 dark:border-lime-700 px-2 py-1 rounded-md">
          l
        </kbd>{" "}
        to toggle color themes!
      </p>
    </div>
  )
}
