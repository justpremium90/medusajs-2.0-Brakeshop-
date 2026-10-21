import { T } from "@lib/i18n/client"
import { Badge } from "@medusajs/ui"

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">
        <T>Attention:</T>
      </span>{" "}
      <T>For testing purposes only.</T>
    </Badge>
  )
}

export default PaymentTest
