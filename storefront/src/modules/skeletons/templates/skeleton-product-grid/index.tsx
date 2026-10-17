import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = ({
  variant = "default",
}: {
  variant?: "default" | "performance"
}) => {
  const isPerformance = variant === "performance"

  return (
    <ul
      className={
        isPerformance
          ? "grid flex-1 grid-cols-2 gap-2 xsmall:gap-4 min-[768px]:grid-cols-3 min-[768px]:gap-5 medium:grid-cols-4 large:gap-6 xlarge:grid-cols-5"
          : "grid flex-1 grid-cols-2 gap-x-5 gap-y-8 small:grid-cols-5 medium:grid-cols-5 large:grid-cols-5"
      }
      data-testid="products-list-loader"
    >
      {repeat(10).map((index) => (
        <li key={index}>
          <SkeletonProductPreview variant={variant} />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
