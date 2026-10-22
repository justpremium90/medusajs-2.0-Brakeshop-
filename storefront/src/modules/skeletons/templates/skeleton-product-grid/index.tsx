import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = ({
  variant = "default",
}: {
  variant?: "default" | "performance"
}) => {
  return (
    <ul className="garden-product-grid" data-testid="products-list-loader">
      {repeat(10).map((index) => (
        <li key={index}>
          <SkeletonProductPreview variant={variant} />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
