"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Users, AlertCircle } from "lucide-react"

interface Step0Props {
  agentId: string
  agents: { id: string; name: string | null }[]
  fieldError?: string
  onAgentChange: (value: string) => void
  onNext: () => void
}

export function Step0AgentSelect({ agentId, agents, fieldError, onAgentChange, onNext }: Step0Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Assign Agent</CardTitle>
            <CardDescription>Select the agent who owns this listing</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Select value={agentId} onValueChange={onAgentChange}>
            <SelectTrigger className={fieldError ? "border-red-500" : ""}>
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name || "Unnamed Agent"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {fieldError}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={onNext}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
