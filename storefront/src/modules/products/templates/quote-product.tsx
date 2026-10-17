import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { HttpTypes } from "@medusajs/types"
import ImageGallery from "@modules/products/components/image-gallery"
import BrandLogo from "@modules/products/components/product-preview/brand-logo"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import WhatsAppContactButton from "@modules/common/components/whatsapp-contact-button"
import { quoteProductMessage } from "@lib/util/quote-product"

export default function QuoteProductTemplate({ product }: { product: HttpTypes.StoreProduct }) {
  const metadata = product.metadata || {}
  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 small:px-[5%]" data-testid="product-container" data-catalog-mode="vehicle_enquiry">
      <Breadcrumbs items={[{ label: "Ana sayfa", href: "/" }, { label: "Zimmermann", href: "/results/Zimmermann" }, { label: "Araç seçkisi", href: "/results/Zimmermann" }, { label: product.title }]} />
      <div className="mt-6 grid items-start gap-8 small:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] small:gap-12">
        <figure className="min-w-0">
          <ImageGallery images={product.images || []} productTitle={`${product.title} — temsili Zimmermann görseli`} />
          <figcaption className="mt-3 text-sm leading-6 text-[#737373]">Temsili Zimmermann görselidir. Aracınız için seçilecek ürünün görünümü ve paket içeriği farklı olabilir.</figcaption>
        </figure>
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <BrandLogo name="Zimmermann" kind="product" />
            <BrandLogo name={String(metadata.vehicle_brand || "")} kind="vehicle" />
          </div>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-[#171717] small:text-3xl" data-testid="product-title">{product.title}</h1>
          <p className="text-base leading-7 text-[#525252]">{product.description}</p>
          <dl className="divide-y divide-[#eaeaea] border-y border-[#eaeaea] text-sm">
            {[["Marka", "Zimmermann"], ["Araç", `${metadata.vehicle_brand || ""} ${metadata.vehicle_model || ""}`], ["Ürün grubu", String(metadata.product_kind || "Fren sistemi")]].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 py-3"><dt className="text-[#737373]">{label}</dt><dd className="font-medium text-[#171717]">{value}</dd></div>
            ))}
          </dl>
          <div className="rounded-lg border border-[#eaeaea] bg-[#f7f7f7] p-5">
            <h2 className="font-semibold text-[#171717]">Aracınız için bilgi alın</h2>
            <p className="mt-2 text-sm leading-6 text-[#525252]">Model yılı ve şasi numarasıyla aracınıza uygun Zimmermann seçeneklerini, fiyatı ve tedarik durumunu birlikte kontrol edelim. Uygunluk ve bulunabilirlik araçtaki fren donanımına göre doğrulanır.</p>
            <WhatsAppContactButton label="Fiyat ve uygunluk sor" message={quoteProductMessage(product)} className="mt-4 min-h-12 w-full rounded-lg bg-[#25D366] px-4 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#159947]" />
          </div>
          <LocalizedClientLink href="/results/Zimmermann" className="text-sm underline underline-offset-4">Diğer Zimmermann araç seçeneklerini inceleyin</LocalizedClientLink>
        </section>
      </div>
    </main>
  )
}
