import dayjs from "dayjs"
import type { V2_MetaFunction } from "@remix-run/react"
import { useFetcher, useLoaderData } from "@remix-run/react"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import type { LinksFunction, LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import relativeTime from "dayjs/plugin/relativeTime"

import styles from "~/tailwind.css"
import { themeCookie } from "./shared/cookies/theme.server"
import type { Theme } from "./utils/types"
import { useEffect } from "react"
import classNames from "classnames"
import { Analytics } from "@vercel/analytics/react"

dayjs.extend(relativeTime)

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Node Packages" },
    {
      name: "description",
      content:
        "A weekend side-project thingie for NPM, just me trying out Remix on Vercel platform.",
    },
  ]
}

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon-48x48.png", sizes: "48x48" },
  { rel: "icon", href: "/favicon-64x64.png", sizes: "48x48" },
  { rel: "icon", href: "/favicon-96x96.png", sizes: "96x96" },
  { rel: "icon", href: "/favicon-144x144.png", sizes: "144x144" },
  { rel: "icon", href: "/favicon-192x192.png", sizes: "144x144" },
  {
    rel: "stylesheet",
    href: styles,
  },
]

export const loader = async ({ request }: LoaderArgs) => {
  const theme: Theme | null = await themeCookie.parse(
    request.headers.get("Cookie"),
  )

  return json({ theme })
}

export default function App() {
  const fetcher = useFetcher()
  const { theme } = useLoaderData<typeof loader>()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { tagName } = e.target as HTMLElement
      if (tagName === "INPUT") return
      if (e.code.toLowerCase() === "keyd") {
        fetcher.submit(
          { theme: "dark" },
          { method: "POST", action: "/change-theme" },
        )
      } else if (e.code.toLowerCase() === "keyl") {
        fetcher.submit(
          { theme: "light" },
          { method: "POST", action: "/change-theme" },
        )
      }
    }

    document.addEventListener("keyup", handler)
    return () => document.removeEventListener("keyup", handler)
  }, [fetcher])

  return (
    <html
      lang="en"
      className={classNames("accent-lime-800 dark:accent-lime-300", {
        dark: theme === "dark",
      })}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans flex flex-col min-h-screen bg-zinc-100 dark:bg-zinc-900 dark:text-lime-300">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "production" && <Analytics />}
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
