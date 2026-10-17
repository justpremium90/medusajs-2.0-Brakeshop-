import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const EditorialListingHeading = ({
  title,
  description,
  sort,
}: {
  title: string
  description?: string | null
  sort: SortOptions
}) => (
  <header className="mb-10 border-b-2 border-[#1d1a17] pb-5 text-[#1d1a17] small:mb-14 small:pb-7">
    <div className="mb-4 flex items-center justify-between border-b border-[#1d1a17] pb-2 text-[10px] font-bold uppercase tracking-[0.18em]">
      <span className="text-[#d1492e]">BrakeShop Journal</span>
      <span>Parça rehberi / Güncel seçki</span>
    </div>
    <div className="grid gap-5 small:grid-cols-12 small:items-end">
      <div className="small:col-span-8">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b655e]">Fren sistemleri</p>
        <h1
          className="max-w-[900px] text-[44px] font-normal leading-[0.9] tracking-[-0.055em] small:text-[72px] medium:text-[92px]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {title}
        </h1>
      </div>
      <div className="small:col-span-4 small:border-l small:border-[#1d1a17] small:pl-6">
        <p className="max-w-[420px] text-[13px] leading-[1.55] text-[#57524c]">
          {description || "Doğru fren parçasını teknik bilgi, güvenilir tedarik ve uzman seçkisiyle bulun."}
        </p>
        <div className="mt-5 min-h-11 border-t border-[#aaa198] pt-3">
          <RefinementList sortBy={sort} />
        </div>
      </div>
    </div>
  </header>
)

export default EditorialListingHeading
