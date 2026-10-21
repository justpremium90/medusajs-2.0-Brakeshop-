"use client"
import { stripCountryPrefix } from "@lib/util/public-path"

import { T } from "@lib/i18n/client"
import { Listbox, Transition } from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<CountryOption | undefined>(undefined)

  const { countryCode } = useParams()
  const currentPath = stripCountryPrefix(usePathname())

  const { state, close } = toggleState

  // A country without an iso_2 cannot be routed to, and handleChange would
  // have passed undefined straight into updateRegion. Dropping those here
  // keeps the list honestly typed as CountryOption[].
  const options: CountryOption[] = useMemo(() => {
    return (regions ?? [])
      .flatMap((r) =>
        (r.countries ?? []).flatMap((c) =>
          c.iso_2 === "tr"
            ? [
                {
                  country: c.iso_2,
                  region: r.id,
                  label: c.display_name ?? c.iso_2.toUpperCase(),
                },
              ]
            : []
        )
      )
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      setCurrent(options.find((o) => o.country === countryCode))
    }
  }, [options, countryCode])

  const handleChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    close()
  }

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options.find((o) => o.country === countryCode)
            : undefined
        }
      >
        <Listbox.Button
          className="py-1 w-full"
          data-testid="shipping-to-button"
        >
          <div className="txt-compact-small flex items-start gap-x-2">
            <span>
              <T>Shipping to:</T>
            </span>
            {current && (
              <span className="txt-compact-small flex items-center gap-x-2">
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  countryCode={current.country ?? ""}
                />
                <T>{current.label}</T>
              </span>
            )}
          </div>
        </Listbox.Button>
        <div className="flex relative w-full min-w-[320px]">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute -bottom-[calc(100%-36px)] left-0 xsmall:left-auto xsmall:right-0 max-h-[442px] overflow-y-scroll z-[900] bg-white drop-shadow-md text-small-regular uppercase text-black no-scrollbar rounded-rounded w-full"
              static
              data-testid="shipping-to-choices"
            >
              {options.map((o, index) => {
                return (
                  <Listbox.Option
                    key={index}
                    value={o}
                    className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center gap-x-2"
                    data-testid={`select-${o.country}-choice`}
                  >
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o.country}
                    />
                    <T> </T>
                    <T>{o.label}</T>
                  </Listbox.Option>
                )
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect
