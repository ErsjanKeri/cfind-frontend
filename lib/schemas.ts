import { z } from "zod"

export const ListingSchema = z.object({
    // Private fields
    realBusinessName: z.string().min(2),
    realStreet: z.string().min(5),
    realCity: z.string().min(2),
    realDescriptionEn: z.string().optional(),

    // Public fields - English only
    publicTitleEn: z.string().min(5, "Title must be at least 5 characters"),
    publicDescriptionEn: z.string().min(20, "Description must be at least 20 characters"),
    publicArea: z.string().min(2),
    publicCity: z.string().min(2),
    category: z.string(),

    // Currency fields - REQUIRED (separate EUR and LEK)
    askingPriceEur: z.coerce.number().positive("Asking price in EUR is required"),
    askingPriceLek: z.coerce.number().positive("Asking price in LEK is required"),
    monthlyRevenueEur: z.coerce.number().positive().optional(),
    monthlyRevenueLek: z.coerce.number().positive().optional(),

    // Business details
    employeeCount: z.coerce.number().optional(),
    yearsInOperation: z.coerce.number().optional(),
    isPhysicallyVerified: z.boolean().default(false),

    // Images
    images: z.array(z.string()).min(1, "At least one image is required"),

    // Optional agentId for admins
    agentId: z.string().optional(),
})

export const BuyerDemandSchema = z.object({
    // Budget - Dual Currency (both required)
    budgetMinEur: z.coerce.number().positive("Minimum budget in EUR is required"),
    budgetMaxEur: z.coerce.number().positive("Maximum budget in EUR is required"),
    budgetMinLek: z.coerce.number().positive("Minimum budget in LEK is required"),
    budgetMaxLek: z.coerce.number().positive("Maximum budget in LEK is required"),

    // Demand Type
    demandType: z.enum(["investor", "seeking_funding"]).default("investor"),

    // Category
    category: z.string().min(1, "Category is required"),

    // Location - English only
    preferredCityEn: z.string().min(2, "Preferred city is required"),
    preferredArea: z.string().optional(),

    // Description
    description: z.string().min(20, "Description must be at least 20 characters"),
})
.refine((data) => data.budgetMaxEur >= data.budgetMinEur, {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["budgetMaxEur"],
})
