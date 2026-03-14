import { z } from "zod"

export const ListingSchema = z.object({
    // Private fields
    real_business_name: z.string().min(2),
    real_location_address: z.string().min(5),
    real_description_en: z.string().optional(),

    // Public fields - English only
    public_title_en: z.string().min(5, "Title must be at least 5 characters"),
    public_description_en: z.string().min(20, "Description must be at least 20 characters"),
    public_location_area: z.string().min(2),
    public_location_city_en: z.string().min(2),
    category: z.string(),

    // Currency fields (EUR only)
    asking_price_eur: z.coerce.number().positive("Asking price is required"),
    monthly_revenue_eur: z.coerce.number().nonnegative().optional(),

    // Business details
    employee_count: z.coerce.number().optional(),
    years_in_operation: z.coerce.number().optional(),
    is_physically_verified: z.boolean().default(false),

    // Images
    images: z.array(z.string()).min(1, "At least one image is required"),

    // Optional agent_id for admins
    agent_id: z.string().optional(),
})

export const BuyerDemandSchema = z.object({
    // Budget (EUR only)
    budget_min_eur: z.coerce.number().positive("Minimum budget is required"),
    budget_max_eur: z.coerce.number().positive("Maximum budget is required"),

    // Demand Type
    demand_type: z.enum(["investor", "seeking_funding"]).default("investor"),

    // Category
    category: z.string().min(1, "Category is required"),

    // Location - English only
    preferred_city_en: z.string().min(2, "Preferred city is required"),
    preferred_area: z.string().optional(),

    // Description
    description: z.string().min(20, "Description must be at least 20 characters"),
})
.refine((data) => data.budget_max_eur >= data.budget_min_eur, {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["budget_max_eur"],
})

export const ChatMessageSchema = z.object({
    message: z.string().min(1, "Message is required").max(2000, "Message is too long"),
    conversation_id: z.string().nullable().optional(),
    language: z.string().max(10).default("en"),
})
