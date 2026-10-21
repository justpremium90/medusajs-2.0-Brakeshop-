"use client"

import { T, I18nElement } from "@lib/i18n/client"
import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
  buttonClassName,
  onDeleted,
  "data-testid": dataTestId,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  buttonClassName?: string
  onDeleted?: () => void
  "data-testid"?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    setError(null)

    try {
      await deleteLineItem(id)
      onDeleted?.()
      router.refresh()
    } catch (error) {
      console.error(error)
      setError(
        error instanceof Error
          ? error.message
          : "Ürün sepetten silinemedi. Tekrar deneyin."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={clx("flex flex-col items-start text-small-regular", className)}
    >
      <I18nElement
        as="button"
        type="button"
        className={clx(
          "flex min-h-10 items-center gap-x-1.5 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer disabled:cursor-wait disabled:opacity-60",
          buttonClassName
        )}
        onClick={() => handleDelete(id)}
        disabled={isDeleting}
        aria-label="Ürünü sepetten sil"
        data-testid={dataTestId}
      >
        {isDeleting ? (
          <Spinner className="shrink-0 animate-spin" />
        ) : (
          <Trash className="shrink-0" />
        )}
        {children ? <span className="leading-5">{children}</span> : null}
      </I18nElement>
      {error && (
        <span className="mt-1 text-xs leading-4 text-rose-600" role="alert">
          <T>{error}</T>
        </span>
      )}
    </div>
  )
}

export default DeleteButton
