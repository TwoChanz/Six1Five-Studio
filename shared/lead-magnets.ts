/**
 * Free resources offered in exchange for contact details ("lead magnets"),
 * plus the validation used by POST /api/leads.
 *
 * Shared by the client (form + download link) and the server (validation,
 * which file to hand back, what to record on the lead). The server decides
 * which file a visitor gets, so a request can't point the download anywhere else.
 */

import { z } from "zod";

export interface LeadMagnet {
  /** Recorded on the lead as resource_requested. */
  title: string;
  /** Public path of the file (served from client/public). */
  downloadUrl: string;
  /** File name offered to the browser when downloading. */
  fileName: string;
}

export const LEAD_MAGNETS = {
  "roi-guide": {
    title: "Reality Capture ROI Guide",
    downloadUrl: "/downloads/six1five-reality-capture-roi-guide.pdf",
    fileName: "Six1Five-Studio-Reality-Capture-ROI-Guide.pdf",
  },
} as const satisfies Record<string, LeadMagnet>;

export type LeadMagnetId = keyof typeof LEAD_MAGNETS;

const leadMagnetIds = Object.keys(LEAD_MAGNETS) as [LeadMagnetId, ...LeadMagnetId[]];

/** Name of the hidden field that people never see but form-filling bots do. */
export const HONEYPOT_FIELD = "website";

/** Fields the lead form sends to POST /api/leads. */
export const leadRequestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().toLowerCase().max(254, "Email is too long").email("Please enter a valid email address"),
  company: z
    .string()
    .trim()
    .max(120, "Company name is too long")
    .optional()
    .transform((value) => (value ? value : undefined)),
  source: z
    .string()
    .trim()
    .max(60)
    .regex(/^[a-z0-9_-]+$/i)
    .catch("unknown"),
  resource: z.enum(leadMagnetIds).default("roi-guide"),
  [HONEYPOT_FIELD]: z.string().max(500).optional(),
});

export type LeadRequest = z.input<typeof leadRequestSchema>;

/** What POST /api/leads returns on success. Contains no stored lead data. */
export interface LeadResponse {
  success: true;
  downloadUrl: string;
  fileName: string;
}
