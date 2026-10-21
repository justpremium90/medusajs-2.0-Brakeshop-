import { localizeMetadata } from "@lib/i18n/metadata"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"
import { getStoreName } from "@lib/util/env"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    notFound()
  }

  return await localizeMetadata({
    title: `${product.title} | ${getStoreName()}`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | ${getStoreName()}`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  })
}

export default async function ProductPage({ params }: Props) {
  const { handle, countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProductByHandle(handle, region.id)
  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={countryCode}
    />
  )
}
