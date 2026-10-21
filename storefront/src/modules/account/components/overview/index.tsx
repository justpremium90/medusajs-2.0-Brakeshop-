import { T } from "@lib/i18n/client"
import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="text-xl-semi flex justify-between items-center mb-4">
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            <T>Hello </T>
            <T>{customer?.first_name}</T>
          </span>
          <span className="text-small-regular text-ui-fg-base">
            <T>Signed in as:</T>
            <T> </T>
            <span
              className="font-semibold"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              <T>{customer?.email}</T>
            </span>
          </span>
        </div>
        <div className="flex flex-col py-8 border-t border-gray-200">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="flex items-start gap-x-16 mb-6">
              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">
                  <T>Profile</T>
                </h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    <T>{getProfileCompletion(customer)}</T>%
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    <T>Completed</T>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">
                  <T>Addresses</T>
                </h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    <T>{customer?.addresses?.length || 0}</T>
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    <T>Saved</T>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-large-semi">
                  <T>Recent orders</T>
                </h3>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <Container className="bg-gray-50 flex justify-between items-center p-4">
                            <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
                              <span className="font-semibold">
                                <T>Date placed</T>
                              </span>
                              <span className="font-semibold">
                                <T>Order number</T>
                              </span>
                              <span className="font-semibold">
                                <T>Total amount</T>
                              </span>
                              <span data-testid="order-created-date">
                                <T>
                                  {new Date(order.created_at).toDateString()}
                                </T>
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #<T>{order.display_id}</T>
                              </span>
                              <span data-testid="order-amount">
                                <T>
                                  {convertToLocale({
                                    amount: order.total,
                                    currency_code: order.currency_code,
                                  })}
                                </T>
                              </span>
                            </div>
                            <button
                              className="flex items-center justify-between"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                <T>Go to order #</T>
                                <T>{order.display_id}</T>
                              </span>
                              <ChevronDown className="-rotate-90" />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span data-testid="no-orders-message">
                    <T>No recent orders</T>
                  </span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
