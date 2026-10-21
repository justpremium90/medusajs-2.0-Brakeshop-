import { T } from "@lib/i18n/client"
const ErrorMessage = ({
  error,
  "data-testid": dataTestid,
}: {
  error?: string | null
  "data-testid"?: string
}) => {
  if (!error) {
    return null
  }

  return (
    <div
      className="pt-2 text-rose-500 text-small-regular"
      data-testid={dataTestid}
    >
      <span>
        <T>{error}</T>
      </span>
    </div>
  )
}

export default ErrorMessage
