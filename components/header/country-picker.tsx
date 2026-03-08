import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { countries, VALID_COUNTRY_CODES, type CountryCode } from "@/lib/constants"

interface CountryPickerProps {
    currentCountry: CountryCode
    onCountrySwitch: (code: CountryCode) => void
}

export function CountryPicker({ currentCountry, onCountrySwitch }: CountryPickerProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 px-2">
                    <span className="text-base leading-none">{countries[currentCountry].flag}</span>
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Country</DropdownMenuLabel>
                {VALID_COUNTRY_CODES.map((code) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => onCountrySwitch(code)}
                        className={`cursor-pointer ${code === currentCountry ? "bg-muted font-medium" : ""}`}
                    >
                        <span className="mr-2 text-base">{countries[code].flag}</span>
                        {countries[code].name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
