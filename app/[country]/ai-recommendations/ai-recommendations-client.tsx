"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@/lib/hooks/useAuth"
import { useRole } from "@/lib/hooks/useRole"
import {
  useConversations,
  useConversation,
  useSendMessage,
  useDeleteConversation,
} from "@/lib/hooks/useChat"
import type { CountryCode } from "@/lib/constants"
import type { ChatMessage } from "@/lib/api/types"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Trash2,
  ArrowLeft,
  Loader2,
  Search,
  Menu,
  X,
} from "lucide-react"

export function AIRecommendationsClient({ country }: { country: CountryCode }) {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const { isBuyer, isAdmin } = useRole()

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: conversations, isLoading: convsLoading } = useConversations()
  const { data: conversationDetail } = useConversation(activeConversationId)
  const sendMessage = useSendMessage()
  const deleteConversation = useDeleteConversation()

  // Sync messages from loaded conversation
  useEffect(() => {
    if (conversationDetail?.messages) {
      setLocalMessages(conversationDetail.messages)
    }
  }, [conversationDetail])

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [localMessages, sendMessage.isPending])

  // Auth guard
  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!user || (!isBuyer && !isAdmin)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">AI Recommendations</h2>
            <p className="text-muted-foreground mb-6">
              Sign in as a buyer to get personalized business recommendations powered by AI.
            </p>
            <Button onClick={() => router.push("/login")}>Sign In</Button>
          </div>
        </div>
      </div>
    )
  }

  const handleSend = async () => {
    const message = input.trim()
    if (!message || sendMessage.isPending) return

    setInput("")

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: message,
      tool_calls: null,
      created_at: new Date().toISOString(),
    }
    setLocalMessages((prev) => [...prev, tempUserMsg])

    try {
      const response = await sendMessage.mutateAsync({
        message,
        conversation_id: activeConversationId,
        language: "en",
      })

      // If this was a new conversation, set the active ID
      if (!activeConversationId) {
        setActiveConversationId(response.conversation_id)
      }

      // Add AI response
      const aiMsg: ChatMessage = {
        id: response.message_id,
        role: "model",
        content: response.content,
        tool_calls: response.tool_calls,
        created_at: new Date().toISOString(),
      }
      setLocalMessages((prev) => [...prev, aiMsg])
    } catch {
      // Remove optimistic message on error
      setLocalMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewConversation = () => {
    setActiveConversationId(null)
    setLocalMessages([])
    setSidebarOpen(false)
    textareaRef.current?.focus()
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    setLocalMessages([])
    setSidebarOpen(false)
  }

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation.mutateAsync(id)
    if (activeConversationId === id) {
      handleNewConversation()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:relative z-40 h-[calc(100vh-4rem)] w-72
            border-r border-border bg-background
            flex flex-col transition-transform duration-200
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-3 border-b border-border flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleNewConversation}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden ml-2 h-8 w-8"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {convsLoading ? (
              <div className="p-3 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : conversations?.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              <div className="p-2 space-y-0.5">
                {conversations?.map((conv) => (
                  <div
                    key={conv.id}
                    className={`
                      group flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer text-sm
                      hover:bg-accent transition-colors
                      ${activeConversationId === conv.id ? "bg-accent" : ""}
                    `}
                    onClick={() => handleSelectConversation(conv.id)}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1">
                      {conv.title || "New conversation"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteConversation(conv.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] min-w-0">
          {/* Chat header */}
          <div className="h-12 border-b border-border flex items-center px-4 gap-3 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI Recommendations</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {localMessages.length === 0 ? (
              <EmptyState country={country} onSuggestion={(text) => {
                setInput(text)
                textareaRef.current?.focus()
              }} />
            ) : (
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {localMessages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} country={country} />
                ))}
                {sendMessage.isPending && (
                  <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Search className="h-3.5 w-3.5 animate-pulse" />
                      Searching for recommendations...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 shrink-0">
            <div className="max-w-3xl mx-auto">
              {sendMessage.isError && (
                <p className="text-sm text-destructive mb-2">
                  {sendMessage.error?.message || "Failed to send message. Please try again."}
                </p>
              )}
              <div className="flex gap-2 items-end">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask about businesses for sale..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className="min-h-[44px] max-h-32 resize-none"
                  disabled={sendMessage.isPending}
                />
                <Button
                  size="icon"
                  className="h-11 w-11 shrink-0"
                  onClick={handleSend}
                  disabled={!input.trim() || sendMessage.isPending}
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI can make mistakes. Verify important business information with the listing agent.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function EmptyState({
  country,
  onSuggestion,
}: {
  country: CountryCode
  onSuggestion: (text: string) => void
}) {
  const countryName = country === "al" ? "Albania" : "UAE"

  const suggestions = [
    `Show me restaurants for sale in ${countryName}`,
    `What businesses are available under €50,000?`,
    `Find me high-ROI businesses in ${country === "al" ? "Tirana" : "Dubai"}`,
    `Compare cafes and bars available in ${countryName}`,
  ]

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-lg text-center">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">AI Business Recommendations</h2>
        <p className="text-muted-foreground mb-8">
          Ask me about businesses for sale in {countryName}. I can search, compare,
          and recommend businesses based on your preferences.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {suggestions.map((text) => (
            <button
              key={text}
              onClick={() => onSuggestion(text)}
              className="text-left text-sm p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  country,
}: {
  message: ChatMessage
  country: CountryCode
}) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <div
        className={`
          max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
          ${isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
          }
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <AIMessageContent content={message.content} country={country} />
        )}
      </div>
      {isUser && (
        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-medium text-muted-foreground">U</span>
        </div>
      )}
    </div>
  )
}

function AIMessageContent({ content, country }: { content: string; country: CountryCode }) {
  // Simple markdown-ish rendering: bold, listing links, line breaks
  const parts = content.split(/(\*\*[^*]+\*\*)/g)

  return (
    <div className="space-y-2 whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        return <span key={i}>{part}</span>
      })}
    </div>
  )
}
