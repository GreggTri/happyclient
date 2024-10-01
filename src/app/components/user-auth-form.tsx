"use client"
import * as React from "react"
//import { useSearchParams } from "next/navigation"

//import { signIn } from "next-auth/react"

import { cn } from "@/app/lib/utils"
//import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Icons } from "./icons"
import { useFormState, useFormStatus } from "react-dom"
import { loginUser } from "../(auth)/login/actions"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}


export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [state, action] = useFormState(loginUser, undefined)

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form action={action}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
            {state?.errors?.email &&  <p className="text-red-500">{state.errors.email}</p>}
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
            />
            {state?.errors?.password &&  <p className="text-red-500">{state.errors.password}</p>}
          </div>
          <LoginButton/>
        </div>
        {state?.message &&  <p className="text-red-500">{state.message}</p>}
      </form>
      <div className="relative ">
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-muted-foreground-">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={`${cn(buttonVariants({ variant: "outline" }))} border-primary text-primary`}
        // onClick={() => {
        //     setIsGoogleLoading(true)
        //     setIsLoading(true)
        //     signIn("google")
        // }}
        //disabled={isLoading || isGoogleLoading}
      >
        {/* {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "} */}
        Google
      </button>
    </div>
  )
}

export function LoginButton() {
  
  const { pending } = useFormStatus();

  return (
    <button 
      className={cn(buttonVariants())} 
      disabled={pending}
      >
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Sign In with Email
    </button>
  );
}