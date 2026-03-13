"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { RegisterRequest } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconInput } from "@/components/shared/icon-input"
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, Mail, Lock, User, Briefcase, TrendingUp, ArrowRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { RegisterAgentFields, type AgentFieldsData } from "@/components/auth/register-agent-fields"
import { getCountryOrDefault } from "@/lib/country"

export function RegisterForm() {
    const router = useRouter()
    const [role, setRole] = useState<'buyer' | 'agent'>("buyer")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [companyName, setCompanyName] = useState("")

    const [agentFields, setAgentFields] = useState<AgentFieldsData>({
        operating_country: getCountryOrDefault(),
        company_name: "",
        license_number: "",
        phone: "",
        whatsapp_number: "",
        license_document: null,
        company_document: null,
        id_document: null,
    })

    const handleAgentFieldChange = (field: keyof AgentFieldsData, value: string | File | null) => {
        setAgentFields((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const currentCountry = getCountryOrDefault()
            const data: Record<string, string | File> = {
                name,
                email,
                password,
                role,
                country_preference: currentCountry,
            }

            if (role === 'agent') {
                if (!agentFields.operating_country) {
                    throw new Error("Operating country is required for agent registration")
                }
                if (!agentFields.whatsapp_number) {
                    throw new Error("WhatsApp number is required for agent registration")
                }
                if (!agentFields.license_document || !agentFields.company_document || !agentFields.id_document) {
                    throw new Error("All documents (License, Company, ID/Passport) are required for agent registration")
                }

                data.operating_country = agentFields.operating_country
                data.company_name = agentFields.company_name
                data.license_number = agentFields.license_number
                data.phone = agentFields.phone
                data.whatsapp = agentFields.whatsapp_number
                data.license_document = agentFields.license_document
                data.company_document = agentFields.company_document
                data.id_document = agentFields.id_document
            } else {
                data.company_name = companyName
            }

            await api.auth.register(data as unknown as RegisterRequest)

            toast.success("Registration successful! Please check your email to verify your account.")

            router.push("/login?registered=true")
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred"
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

            {role === "agent" && (
                <RegisterAgentFields
                    data={agentFields}
                    onChange={handleAgentFieldChange}
                    disabled={isLoading}
                />
            )}

            <FormFieldWrapper label="Full Name" htmlFor="name">
                <IconInput
                    icon={User}
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </FormFieldWrapper>

            <FormFieldWrapper label="Email" htmlFor="email">
                <IconInput
                    icon={Mail}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </FormFieldWrapper>

            <FormFieldWrapper label="Password" htmlFor="password">
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10 pr-10"
                        minLength={8}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Minimum 8 characters
                </p>
            </FormFieldWrapper>

            {role === "buyer" && (
                <FormFieldWrapper label="Company Name" htmlFor="companyName">
                    <Input
                        id="companyName"
                        name="companyName"
                        placeholder="Your Company Name (optional)"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
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
                <Link href="/cookies" className="text-primary hover:underline">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/cookies" className="text-primary hover:underline">
                    Privacy Policy
                </Link>
            </p>
        </form>
    )
}
