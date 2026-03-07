"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface LoginFormProps {
    showResendVerification?: boolean
}

export function LoginForm({ showResendVerification = false }: LoginFormProps) {
    const router = useRouter()
    const { login } = useAuth()

    // Form state
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Resend verification state
    const [resending, setResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)

    // Check if error is due to unverified email
    const isUnverifiedError = error && (error.includes("verify") || error.includes("Verification") || error.includes("not verified"))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            await login(email, password)
            toast.success("Logged in successfully!")
            router.push("/profile")
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred"
            setError(errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendVerification = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error("Please enter your email address in the form above")
            return
        }

        setResending(true)
        try {
            await api.auth.resendVerification(email)
            setResendSuccess(true)
            toast.success("Verification email sent! Please check your inbox.")
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "An unexpected error occurred")
        } finally {
            setResending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {resendSuccess && (
                <Alert className="border-green-200 bg-green-50">
                    <Mail className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        Verification email sent! Please check your inbox.
                    </AlertDescription>
                </Alert>
            )}

            {error && !isUnverifiedError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                </Alert>
            )}

            {isUnverifiedError && (
                <Alert variant="destructive" className="border-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <div className="space-y-2">
                            <p className="font-semibold">Email Not Verified</p>
                            <p className="text-sm">
                                {error}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleResendVerification}
                                disabled={resending || !email}
                                className="mt-2 w-full bg-white hover:bg-gray-50"
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                {resending ? "Sending..." : "Resend Verification Email"}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Enter your email above and click this button to resend the verification link.
                            </p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                        minLength={6}
                    />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
            </Button>
        </form>
    )
}
