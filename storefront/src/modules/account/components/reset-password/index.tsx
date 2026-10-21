"use client"

import { T } from "@lib/i18n/client"
import { useActionState } from "react"

import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { resetPassword } from "@lib/data/customer"

type Props = {
  /** The single-use token from the reset link. */
  token: string
  /**
   * The address the reset was requested for, shown so the visitor can see which
   * account they are changing. Display only: the account is identified by the
   * token, and the update route ignores any identifier in the request body.
   */
  email?: string
}

const ResetPassword = ({ token, email }: Props) => {
  const [state, formAction] = useActionState(resetPassword, {
    success: false,
    error: null,
  })

  if (state.success) {
    return (
      <div
        className="max-w-sm w-full flex flex-col items-center"
        data-testid="reset-password-page"
      >
        <h1 className="text-large-semi uppercase mb-6">
          <T>Password updated</T>
        </h1>
        <p
          className="text-center text-base-regular text-ui-fg-base mb-8"
          data-testid="reset-password-success"
        >
          <T>Your password has been changed. You can sign in with it now.</T>
        </p>
        <LocalizedClientLink
          href="/account"
          className="underline text-small-regular"
          data-testid="go-to-sign-in-link"
        >
          <T>Go to sign in</T>
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="reset-password-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        <T>Set a new password</T>
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {email ? (
          <>
            <T>Choose a new password for </T>
            <strong>
              <T>{email}</T>
            </strong>
            .
          </>
        ) : (
          "Choose a new password for your account."
        )}
      </p>

      <form className="w-full" action={formAction}>
        {/* The token travels with the form rather than being read from the URL
            inside the action: a server action gets no request URL, and passing
            it explicitly is also what makes the form work after a failed
            attempt without re-reading the address bar. */}
        <input type="hidden" name="token" value={token} />

        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            data-testid="new-password-input"
          />
          <Input
            label="Confirm new password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            data-testid="confirm-password-input"
          />
        </div>

        <ErrorMessage
          error={state.error}
          data-testid="reset-password-error-message"
        />

        <SubmitButton
          data-testid="reset-password-button"
          className="w-full mt-6"
        >
          <T>Save new password</T>
        </SubmitButton>
      </form>

      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        <T>Link expired?</T>
        <T> </T>
        <LocalizedClientLink
          href="/account"
          className="underline"
          data-testid="request-new-link"
        >
          <T>Request a new one</T>
        </LocalizedClientLink>
        .
      </span>
    </div>
  )
}

export default ResetPassword
