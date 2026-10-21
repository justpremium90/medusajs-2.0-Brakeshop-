import { T } from "@lib/i18n/client"
import { Button, Container, Text } from "@medusajs/ui"
import { cookies } from "next/headers"

const ProductOnboardingCta = async () => {
  const cookieStore = await cookies()
  const isOnboarding = cookieStore.get("_medusa_onboarding")?.value === "true"

  if (!isOnboarding) {
    return null
  }

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full p-8">
      <div className="flex flex-col gap-y-4 center">
        <Text className="text-ui-fg-base text-xl">
          <T>Demo ürününüz başarıyla oluşturuldu! 🎉</T>
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          <T>Mağaza kurulumuna admin panelinde devam edebilirsiniz.</T>
        </Text>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="w-full">
            <T>Kuruluma adminde devam et</T>
          </Button>
        </a>
      </div>
    </Container>
  )
}

export default ProductOnboardingCta
