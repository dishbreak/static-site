import * as z from 'zod'

export const ResumeSchema = z.object({
    "name": z.string(),
    "objective": z.string(),
    "skills": z.object({
        "languages": z.array(z.string()),
        "tools": z.array(z.string()),
    }),
    "keywords": z.array(z.string()),
    "summary": z.array(z.string()),
    "key_achievements": z.array(z.string()),
    "experience": z.array(z.object({
        org: z.string(),
        startDate: z.iso.date(),
        endDate: z.optional(z.iso.date()),
        truncated: z.boolean().default(false),
        positions: z.array(z.object({
            position: z.string(),
            startDate: z.iso.date(),
            endDate: z.optional(z.iso.date()),
            key_points: z.array(z.string()),
            key_technologies: z.array(z.string()),
        }))
    })),
    "education": z.array(z.object({
        institution: z.string(),
        yearFrom: z.number(),
        yearTo: z.number(),
        degree: z.string(),
    }))
})

export type Resume = z.infer<typeof ResumeSchema>
