
import * as z from "zod";

export const newsletterFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  accessCode: z.string().optional(),
  investmentLevel: z.enum(["$100K-$500K", "$500K-$1M", "$1M-$5M", "$5M+"], {
    required_error: "Please select your investment level",
  }),
  interests: z.array(z.string()).optional(),
  referralSource: z.string().optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
