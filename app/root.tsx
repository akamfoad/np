import dayjs from "dayjs"
import type { V2_MetaFunction } from "@remix-run/react"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import type { LinksFunction } from "@remix-run/node"
import relativeTime from "dayjs/plugin/relativeTime"

import styles from "~/tailwind.css"

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

export default function App() {
  return (
    <html lang="en" className="accent-lime-800">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans flex flex-col min-h-screen bg-zinc-100">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
