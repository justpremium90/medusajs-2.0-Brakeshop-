import { localizeMetadata } from "@lib/i18n/metadata"
import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import { getStoreName } from "@lib/util/env"

const pageMetadata = {
  title: "Sign in",
  description: `Sign in to your ${getStoreName()} account.`,
}
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
}

export default function Login() {
  return <LoginTemplate />
}
