"use client"

import { T } from "@lib/i18n/client"
import React, { useActionState } from "react"

import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { requestPasswordReset } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

/**
 * Changing a password goes through email, because Medusa allows nothing else.
 *
 * This is not a limitation of the storefront. `POST /auth/:actor/:provider/update`
 * is guarded by `validateToken()`, which rejects any token whose `purpose` claim
 * is not `"reset"` and which has no `jti`. A signed-in customer's session bearer
 * token has neither, so there is no request a logged-in shopper can make that
 * sets their own password directly. The reset token is single use and the
 * middleware consumes it atomically before the update runs.
 *
 * So the button here asks for a reset link rather than opening old/new/confirm
 * inputs. Before this, the section rendered exactly those inputs wired to
 * `useActionState((() => {}) as any, ...)`, an action that did nothing while
 * reporting success.
 *
 * The form posts the customer's own address from the session rather than
 * letting them type one, since this is the account they are already signed in
 * to.
 */
const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [state, formAction] = useActionState(requestPasswordReset, {
    success: false,
    error: null,
  })

  return (
    <div className="w-full">
      <AccountInfo
        label="Password"
        currentInfo={
          <span>
            <T>The password is not shown for security reasons</T>
          </span>
        }
        isEditable={false}
        clearState={() => {}}
        data-testid="account-password-editor"
      />

      <div className="text-small-regular text-ui-fg-subtle pb-8 -mt-4">
        {state.success ? (
          <span data-testid="password-reset-requested">
            <T>A link to set a new password is on its way to </T>
            <T>{customer.email}</T>
            <T>. It can be used once and expires in 15 minutes.</T>
          </span>
        ) : (
          <form action={formAction} className="flex items-center gap-x-2">
            <input type="hidden" name="email" value={customer.email ?? ""} />
            <span>
              <T>To change it, we send you a link by email.</T>
            </span>
            <button
              type="submit"
              className="underline"
              data-testid="request-password-reset-button"
            >
              <T>Send me a reset link</T>
            </button>
            {state.error && (
              <span
                className="text-rose-500"
                data-testid="password-reset-error"
              >
                <T>{state.error}</T>
              </span>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default ProfilePassword
