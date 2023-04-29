import { redirect } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"

import type { Theme } from "~/utils/types"
import { themeCookie } from "~/shared/cookies/theme.server"

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData()

  const theme: Theme | any = body.get("theme")

  if (theme !== "dark" && theme !== "light") {
    return new Response(undefined, { status: 400 })
  }

  return new Response(undefined, {
    status: 200,
    headers: {
      "Set-Cookie": await themeCookie.serialize(theme),
    },
  })
}

export const loader = () => redirect("/")
