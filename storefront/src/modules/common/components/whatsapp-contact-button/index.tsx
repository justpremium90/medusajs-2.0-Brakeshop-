import { BRAKESHOP_COMPANY } from "@lib/constants/company"

type WhatsAppContactButtonProps = {
  message: string
  label?: string
  className?: string
}

const WhatsAppIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 shrink-0 fill-current"
  >
    <path d="M12.04 2a9.84 9.84 0 0 0-8.42 14.93L2 22l5.2-1.58A9.94 9.94 0 1 0 12.04 2Zm0 17.98a8.03 8.03 0 0 1-4.1-1.12l-.29-.17-3.09.94.98-3-.19-.31A7.86 7.86 0 0 1 4.1 12.1a7.94 7.94 0 1 1 7.94 7.88Zm4.35-5.94c-.24-.12-1.41-.69-1.63-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.91-1.18a7.17 7.17 0 0 1-1.32-1.64c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.41-.58 1.61-1.13.2-.56.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28Z" />
  </svg>
)

const WhatsAppContactButton = ({
  message,
  label = "WhatsApp ile Sor",
  className = "",
}: WhatsAppContactButtonProps) => {
  const phone = BRAKESHOP_COMPANY.telephone.replace(/\D/g, "")
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} - ${BRAKESHOP_COMPANY.telephoneDisplay}`}
      className={`inline-flex items-center justify-center gap-2 ${className}`}
    >
      <WhatsAppIcon />
      <span>{label}</span>
    </a>
  )
}

export default WhatsAppContactButton
