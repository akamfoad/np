import { createCookie } from "@remix-run/node"

export const themeCookie = createCookie("theme", {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  secure: true,
})
