import dayjs from "dayjs"
import type { FC } from "react"
import classNames from "classnames"
import { Link } from "@remix-run/react"
import * as Avatar from "@radix-ui/react-avatar"

import { Keyword } from "./Keyword"
import { Keywords } from "./Keywords"

import type { TransformedPackageType } from "~/utils/types"

interface PackageProps extends TransformedPackageType {
  isExactMatch?: boolean
}

export const Package: FC<PackageProps> = ({
  name,
  description,
  keywords,
  publisher,
  version,
  date,
  isExactMatch,
}) => {
  return (
    <section
      key={name}
      className={classNames("flex flex-col rounded-lg p-5", {
        "bg-slate-50 shadow-sm": !isExactMatch,
        "bg-amber-100 shadow-lg": isExactMatch,
      })}
    >
      <h2 className="flex flex-wrap text-lg font-medium">
        <Link className="flex items-center p-1" to={`/${publisher.username}`}>
          <Avatar.Root className="inline-block min-w-[1.75rem] min-h-[1.75rem] w-7 h-7">
            <Avatar.Image
              src={`https://www.gravatar.com/avatar/${publisher.gravatarId}?s=42`}
              alt={name}
              width="28px"
              height="28px"
              className="inline-flex rounded-full"
            />
            <Avatar.Fallback className="rounded-full min-w-[1.75rem] min-h-[1.75rem] w-7 h-7 inline-flex justify-center items-center bg-slate-50">
              {publisher.initials}
            </Avatar.Fallback>
          </Avatar.Root>
          <span className="self-stretch ml-1.5">{publisher.username}</span>
        </Link>
        <span className="select-none p-1 opacity-50">|</span>
        {/* Temporarily pointing them to NPM website until package pages get ready */}
        <Link
          className="p-1"
          to={`https://www.npmjs.com/package/${name}`}
          target="_blank"
          referrerPolicy="no-referrer"
          title="Temporarily opening the package on NPM website, until I add a page for the packages (not promising anything 😁)"
        >
          {name}
        </Link>
        {/* TODO use heroicons here */}
        {/* {searchParams.get("text")?.toLowerCase() === name && (
            <span>✨</span>
          )} */}
      </h2>
      <p className="mt-2.5 text-slate-700">{description}</p>

      {Array.isArray(keywords) && (
        <Keywords>
          {keywords.map((keyword) => (
            <Keyword key={keyword} text={keyword} />
          ))}
        </Keywords>
      )}
      <p className="mt-1 text-xs text-slate-600 tracking-wide">
        {version} <span className="inline-block mx-1">•</span> Published{" "}
        {dayjs(date).fromNow()}
      </p>
    </section>
  )
}
