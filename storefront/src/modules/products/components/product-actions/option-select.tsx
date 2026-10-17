import { HttpTypes } from "@medusajs/types"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

export default function OptionSelect({
  option,
  current,
  updateOption,
  title,
  disabled,
  "data-testid": dataTestId,
}: OptionSelectProps) {
  const values = Array.from(
    new Set(
      option.values
        ?.map((v) => v.value)
        .filter((v): v is string => typeof v === "string") || []
    )
  )
  const label = title.replace(/ Renk Seçenekleri$/i, " rengi")
  return (
    <fieldset className="pdp-option" disabled={disabled}>
      <legend>
        {label}
        <span>{current || "Seçiminizi yapın"}</span>
      </legend>
      <div className="pdp-option-values" data-testid={dataTestId}>
        {values.map((value) => (
          <button
            type="button"
            onClick={() => updateOption(option.title ?? "", value)}
            key={value}
            className="pdp-option-button"
            aria-pressed={value === current}
            data-testid="option-button"
          >
            {value}
            <span className="pdp-option-check" aria-hidden="true">
              ✓
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
