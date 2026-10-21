"use client"

import { T } from "@lib/i18n/client"
import { useActionState } from "react"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { login } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        <T>Welcome back</T>
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        <T>Sign in to access an enhanced shopping experience.</T>
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          <T>Sign in</T>
        </SubmitButton>
      </form>
      <button
        onClick={() => setCurrentView(LOGIN_VIEW.FORGOT_PASSWORD)}
        className="underline text-small-regular mt-4"
        data-testid="forgot-password-button"
      >
        <T>Forgot your password?</T>
      </button>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        <T>Not a member?</T>
        <T> </T>
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          <T>Join us</T>
        </button>
        .
      </span>
    </div>
  )
}

export default Login
