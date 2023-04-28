import { createHash } from "node:crypto"

export const md5 = (email: string) =>
  createHash("md5").update(email).digest("hex")
