import { z } from "zod";

export const questCategories = [
  "Study",
  "Fitness",
  "Coding",
  "Health",
  "Creativity",
  "Personal",
  "Other",
] as const;

export const questDifficulties = ["Easy", "Medium", "Hard", "Epic"] as const;

export const questAttributes = [
  "Strength",
  "Intellect",
  "Discipline",
  "Vitality",
  "Creativity",
] as const;

export const createQuestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be under 100 characters"),
  description: z.string().max(500, "Description must be under 500 characters").default(""),
  category: z.enum(questCategories),
  difficulty: z.enum(questDifficulties),
  attribute: z.enum(questAttributes),
});

export const updateQuestSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(questCategories).optional(),
  difficulty: z.enum(questDifficulties).optional(),
  attribute: z.enum(questAttributes).optional(),
});

export type CreateQuestInput = z.infer<typeof createQuestSchema>;
export type UpdateQuestInput = z.infer<typeof updateQuestSchema>;
