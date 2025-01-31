import { z } from 'zod';

export const rightsRequestSchema = z.object({
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
  reason: z.string().min(10, 'Le motif doit contenir au moins 10 caractères'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: "La date de fin doit être postérieure à la date de début",
  path: ["endDate"]
});

export type RightsRequestFormData = z.infer<typeof rightsRequestSchema>;