"use client"

import { T } from "@lib/i18n/client"
import { Button } from "@medusajs/ui"
import { useEffect } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)] px-6">
      <h1 className="text-2xl-semi text-ui-fg-base">
        <T>Checkout could not continue</T>
      </h1>
      <p className="text-small-regular text-ui-fg-base text-center max-w-md">
        <T>
          Something went wrong while loading this step. Your cart has been kept,
          so nothing has been lost and you have not been charged.
        </T>
      </p>
      {error.digest && (
        <p className="text-small-regular text-ui-fg-muted">
          <T>Reference: </T>
          <T>{error.digest}</T>
        </p>
      )}
      <Button onClick={reset} variant="secondary">
        <T>Try again</T>
      </Button>
      <InteractiveLink href="/cart">
        <T>Back to shopping cart</T>
      </InteractiveLink>
    </div>
  )
}
