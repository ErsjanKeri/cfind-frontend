"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, Mail, Lock, User, Briefcase, TrendingUp, ArrowRight, FileCheck, XCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export function RegisterForm() {
    const router = useRouter()
    const [role, setRole] = useState<'buyer' | 'agent'>("buyer")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form fields
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    // Agent-specific fields
    const [agencyName, setAgencyName] = useState("")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [phone, setPhone] = useState("")

    // Buyer-specific fields
    const [companyName, setCompanyName] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const data: any = {
                name,
                email,
                password,
                role
            }

            // Common field for both roles
            if (role === 'agent') {
                data.company_name = agencyName
                data.license_number = licenseNumber
                data.phone = phone
            } else {
                data.company_name = companyName
            }

            await api.auth.register(data)

            toast({
                title: "Success!",
                description: "Registration successful! Please check your email to verify your account.",
            })

            router.push("/login?registered=true")
        } catch (err: any) {
            const errorMsg = err.message || "Registration failed"
            setError(errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Registration Failed</AlertTitle>
                    <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                </Alert>
            )}

            {/* Role Selection */}
            <div className="space-y-3">
                <Label>I want to...</Label>
                <RadioGroup
                    name="role"
                    defaultValue="buyer"
                    onValueChange={(value) => setRole(value as 'buyer' | 'agent')}
                    className="grid grid-cols-2 gap-3"
                >
                    <Label
                        htmlFor="buyer"
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${role === "buyer"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/50"
                            }`}
                    >
                        <RadioGroupItem value="buyer" id="buyer" className="sr-only" />
                        <TrendingUp className={`h-6 w-6 ${role === "buyer" ? "text-primary" : "text-muted-foreground"}`} />
                        <span
                            className={`text-sm font-medium ${role === "buyer" ? "text-foreground" : "text-muted-foreground"}`}
                        >
                            Buy a Business
                        </span>
                    </Label>
                    <Label
                        htmlFor="agent"
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${role === "agent"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/50"
                            }`}
                    >
                        <RadioGroupItem value="agent" id="agent" className="sr-only" />
                        <Briefcase className={`h-6 w-6 ${role === "agent" ? "text-primary" : "text-muted-foreground"}`} />
                        <span
                            className={`text-sm font-medium ${role === "agent" ? "text-foreground" : "text-muted-foreground"}`}
                        >
                            List as Agent
                        </span>
                    </Label>
                </RadioGroup>
            </div>

            {/* Agent Extra Fields */}
            {
                role === "agent" && (
                    <div className="space-y-4 pt-2 border-t border-border">
                        <p className="text-sm font-medium text-primary flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Agent Details - All Fields Required
                        </p>

                        <FormFieldWrapper
                            label="Agency Name"
                            htmlFor="agencyName"
                            required
                        >
                            <Input
                                id="agencyName"
                                name="agencyName"
                                placeholder="Your Agency Name"
                                value={agencyName}
                                onChange={(e) => setAgencyName(e.target.value)}
                                required={role === "agent"}
                                disabled={isLoading}
                            />
                        </FormFieldWrapper>

                        <FormFieldWrapper
                            label="License Number"
                            htmlFor="licenseNumber"
                            required
                        >
                            <Input
                                id="licenseNumber"
                                name="licenseNumber"
                                placeholder="License #"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                required={role === "agent"}
                                disabled={isLoading}
                            />
                        </FormFieldWrapper>

                        <div className="grid grid-cols-2 gap-4">
                            <FormFieldWrapper
                                label="Phone"
                                htmlFor="phone"
                                required
                            >
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+355 69 123 4567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required={role === "agent"}
                                    disabled={isLoading}
                                />
                            </FormFieldWrapper>

                            <FormFieldWrapper
                                label="WhatsApp (Optional)"
                                htmlFor="whatsapp"
                            >
                                <Input
                                    id="whatsapp"
                                    name="whatsapp"
                                    placeholder="+355 69 123 4567"
                                    disabled={isLoading}
                                />
                            </FormFieldWrapper>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                                <strong>Note:</strong> After registration, you'll be asked to upload your license and company documents from your profile to complete verification.
                            </p>
                        </div>
                    </div>
                )
            }

            <FormFieldWrapper
                label="Full Name"
                htmlFor="name"
            >
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                    />
                </div>
            </FormFieldWrapper>

            <FormFieldWrapper
                label="Email"
                htmlFor="email"
            >
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                    />
                </div>
            </FormFieldWrapper>

            <FormFieldWrapper
                label="Password"
                htmlFor="password"
            >
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                        minLength={8}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Minimum 8 characters
                </p>
            </FormFieldWrapper>

            {role === "buyer" && (
                <FormFieldWrapper
                    label="Company Name"
                    htmlFor="companyName"
                    required
                >
                    <Input
                        id="companyName"
                        name="companyName"
                        placeholder="Your Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required={role === "buyer"}
                        disabled={isLoading}
                    />
                </FormFieldWrapper>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                </Link>
            </p>
        </form >
    )
}
