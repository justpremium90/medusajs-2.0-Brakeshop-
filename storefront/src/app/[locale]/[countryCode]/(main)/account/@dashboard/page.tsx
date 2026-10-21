import { localizeMetadata } from "@lib/i18n/metadata"
import { Metadata } from "next"

import Overview from "@modules/account/components/overview"
import { notFound } from "next/navigation"
import { getCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

const pageMetadata = {
  title: "Account",
  description: "Overview of your account activity.",
}
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
}

export default async function OverviewTemplate() {
  const customer = await getCustomer().catch(() => null)
  const orders = (await listOrders().catch(() => null)) || null

  if (!customer) {
    notFound()
  }

  return <Overview customer={customer} orders={orders} />
}
