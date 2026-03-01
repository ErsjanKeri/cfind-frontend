"use client"

import { HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Why can't sellers list directly?",
    answer: "To protect both buyers and sellers. Agent verification ensures every listing is real, data is accurate, and sellers stay anonymous until they choose to reveal themselves.",
  },
  {
    question: "Do investors need to provide documents?",
    answer: "No! Just create a free account with email and password. The agent will verify your seriousness through conversation, not documents.",
  },
  {
    question: "How long does listing verification take?",
    answer: "Typically 3-5 business days. The agent must physically visit the business and review all documentation before publishing.",
  },
  {
    question: "How do I contact the agent?",
    answer: "Once logged in, you'll see the agent's WhatsApp, phone number, and email on each listing. Choose your preferred method and reach out directly.",
  },
  {
    question: "What does 'blind listing' mean?",
    answer: "The business name and exact address are never shown. Only general details like category, area, and financials are visible to protect the seller's identity.",
  },
  {
    question: "Is there a fee for buyers?",
    answer: "No! Browsing and contacting agents is completely free for buyers. Agents are paid by sellers upon successful sale completion.",
  },
]

export function FaqSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground mb-4">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i + 1}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
