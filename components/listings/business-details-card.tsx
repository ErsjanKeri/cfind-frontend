import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, Eye, Lock, Building2 } from "lucide-react"

interface BusinessDetailsCardProps {
    employeeCount?: number | null
    yearsInOperation?: number | null
    viewCount?: number | null
}

export function BusinessDetailsCard({ employeeCount, yearsInOperation, viewCount }: BusinessDetailsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    Business Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Employees</p>
                            <p className="font-semibold">{employeeCount || "-"}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Years Operating</p>
                            <p className="font-semibold">
                                {yearsInOperation ? `${yearsInOperation} years` : "-"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Eye className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Views</p>
                            <p className="font-semibold">{viewCount || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start gap-3">
                        <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="font-medium text-foreground">Additional Information Hidden</p>
                            <p className="text-sm text-muted-foreground mt-1">Contact the agent to receive the full business profile including exact location, business name, and detailed financials.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
