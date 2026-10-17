import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonRelatedProducts = () => {
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-3 small:mb-12 small:items-center">
        <div className="h-4 w-28 animate-pulse bg-gray-100"></div>
        <div className="h-8 w-72 max-w-full animate-pulse bg-gray-100"></div>
      </div>
      <ul className="grid w-full flex-1 grid-cols-2 gap-x-1 gap-y-11 small:grid-cols-3 small:gap-x-5 small:gap-y-14 medium:grid-cols-4 medium:gap-x-6 large:grid-cols-4 large:gap-x-7">
        {repeat(4).map((index) => (
          <li key={index}>
            <SkeletonProductPreview />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkeletonRelatedProducts
