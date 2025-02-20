import z from "zod";
import { StaffModel } from "./models/staff.js";

// Gehege
export const GehegeSchema = z.object({
  id: z.number().optional(),
  groesse: z.number(),
  instandhaltungskosten: z.number(),
  name: z.string(),
});

export type Gehege = z.infer<typeof GehegeSchema>;

// Tier
export const TierSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  gehege_id: z.number(),
  tierarzt_id: z.number().refine(async (id) => await StaffModel.isVet(id), {
    message: "No Doctor found with this ID",
  }),
});

export type Tier = z.infer<typeof TierSchema>;

// Personal
export const PersonalSchema = z.object({
  id: z.number(),
  beruf_id: z.number(),
});

export type Personal = z.infer<typeof PersonalSchema>;

//
