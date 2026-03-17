"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Mail, Building2 } from "lucide-react"
import Link from "next/link"
import { getErrorMessage } from "@/lib/utils"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setErrorMessage("No verification token provided")
      return
    }

    // Verify email automatically when page loads
    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token: string) => {
    setStatus("loading")
    try {
      await api.auth.verifyEmail(token)
      setStatus("success")
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login?verified=true")
      }, 3000)
    } catch (error) {
      setStatus("error")
      setErrorMessage(getErrorMessage(error, "Failed to verify email"))
    }
  }

  const handleResendVerification = async () => {
    // This would need the email address - for now, direct user to login
    router.push("/login?needsVerification=true")
  }

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
              C<span className="text-primary">find</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>
              {status === "loading" && "Verifying your email address..."}
              {status === "success" && "Email verified successfully!"}
              {status === "error" && "Verification failed"}
            </CardDescription>
          </CardHeader>
          <CardContent>
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <p className="text-muted-foreground text-center">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Email Verified!</h3>
                <p className="text-muted-foreground">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
              </div>
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  Redirecting to login page in 3 seconds...
                </AlertDescription>
              </Alert>
              <Link href="/login?verified=true" className="w-full">
                <Button className="w-full" size="lg">
                  Continue to Login
                </Button>
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Verification Failed</h3>
                <p className="text-muted-foreground">{errorMessage}</p>
              </div>

              {errorMessage.includes("expired") && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800">
                    Your verification link has expired. You can request a new one from the login page.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2 w-full">
                <Link href="/login?needsVerification=true" className="w-full">
                  <Button className="w-full" size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    Go to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </main>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                C<span className="text-primary">find</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardContent className="py-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
