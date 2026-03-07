"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Building2, ArrowRight, CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginForm } from "@/components/auth/login-form"
import { useSearchParams } from "next/navigation"

function LoginFormWrapper() {
  const searchParams = useSearchParams()
  const verified = searchParams?.get("verified")
  const registered = searchParams?.get("registered")
  const passwordReset = searchParams?.get("passwordReset")
  const needsVerification = searchParams?.get("needsVerification")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Company<span className="text-primary">Finder</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success messages */}
            {verified && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Email verified successfully! You can now log in to your account.
                </AlertDescription>
              </Alert>
            )}

            {registered && (
              <Alert className="border-blue-200 bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Registration successful! Please check your email to verify your account before logging in.
                </AlertDescription>
              </Alert>
            )}

            {passwordReset && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Password reset successful! You can now log in with your new password.
                </AlertDescription>
              </Alert>
            )}

            {needsVerification && (
              <Alert className="border-amber-200 bg-amber-50">
                <Mail className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Please check your email for a verification link. If you didn't receive it, you can request a new one below.
                </AlertDescription>
              </Alert>
            )}

            <LoginForm showResendVerification={needsVerification === "true"} />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">New to CompanyFinder?</span>
              </div>
            </div>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Create an Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginFormWrapper />
    </Suspense>
  )
}
