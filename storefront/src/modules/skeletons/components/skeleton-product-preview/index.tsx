import { Container } from "@medusajs/ui"

const SkeletonProductPreview = ({
  variant = "default",
}: {
  variant?: "default" | "performance"
}) => {
  if (variant === "performance") {
    return (
      <div className="h-full animate-pulse overflow-hidden rounded-[9px] border border-[#eaeaea] bg-white">
        <Container className="aspect-square w-full rounded-none bg-[#f3f3f3] shadow-none" />
        <div className="space-y-3 p-4">
          <div className="h-3 w-1/3 rounded bg-[#eeeeee]" />
          <div className="h-4 w-full rounded bg-[#e8e8e8]" />
          <div className="h-4 w-4/5 rounded bg-[#eeeeee]" />
          <div className="h-5 w-2/5 rounded bg-[#e2e2e2]" />
          <div className="h-11 w-full rounded-[5px] bg-[#dedede]" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pulse">
      <Container className="aspect-[9/16] w-full bg-gray-100 bg-ui-bg-subtle" />
      <div className="flex justify-between text-base-regular mt-2">
        <div className="w-2/5 h-6 bg-gray-100"></div>
        <div className="w-1/5 h-6 bg-gray-100"></div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
