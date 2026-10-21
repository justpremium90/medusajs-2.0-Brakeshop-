import { T } from "@lib/i18n/client"
import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          <T>Hesabınız var mı?</T>
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          <T>Daha iyi bir deneyim için giriş yapın.</T>
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-10"
            data-testid="sign-in-button"
          >
            <T>Giriş yap</T>
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
