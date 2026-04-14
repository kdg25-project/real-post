import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accountType: z.enum(["company", "user"], {
    message: "Account type must be 'company' or 'user'",
  }),
  companyName: z.string().optional(),
}).refine(
  (data) => {
    if (data.accountType === "company") {
      return !!data.companyName && data.companyName.trim().length > 0;
    }
    return true;
  },
  {
    message: "Company name is required for company accounts",
    path: ["companyName"],
  }
);

export type SignUpInput = z.infer<typeof signUpSchema>;

export interface SessionResponse {
  user: {
    id: string;
    email: string;
    name: string;
    accountType: "company" | "user";
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  profile:
    | {
        id: string;
        userId: string;
        companyName: string;
        createdAt: Date;
        updatedAt: Date;
      }
    | {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
      }
    | null;
  accountType: "company" | "user";
}
