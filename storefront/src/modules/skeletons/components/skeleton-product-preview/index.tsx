const SkeletonProductPreview = (_props: { variant?: "default" | "performance" }) => (
  <div className="animate-pulse" aria-hidden="true">
    <div className="aspect-[4/3] w-full bg-[#eeede7]" />
    <div className="mt-5 h-2 w-1/4 bg-[#e2e3d9]" />
    <div className="mt-3 h-4 w-3/4 bg-[#e2e3d9]" />
    <div className="mt-4 h-3 w-1/3 bg-[#e2e3d9]" />
  </div>
)
export default SkeletonProductPreview
