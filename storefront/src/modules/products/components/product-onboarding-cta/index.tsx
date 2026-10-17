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
          Demo ürününüz başarıyla oluşturuldu! 🎉
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          Mağaza kurulumuna admin panelinde devam edebilirsiniz.
        </Text>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="w-full">Kuruluma adminde devam et</Button>
        </a>
      </div>
    </Container>
  )
}

export default ProductOnboardingCta
