import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Validates if a company exists and is verified
 * @param companyId - The UUID of the company to validate
 * @returns true if company is verified, false otherwise
 * @throws Error if company doesn't exist
 */
export async function validateCompanyVerification(companyId: string): Promise<boolean> {
  const company = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (company.length === 0) {
    throw new Error("Company not found");
  }

  return company[0].verified;
}

/**
 * Checks if a company is verified
 * @param companyId - The UUID of the company to check
 * @returns true if company exists and is verified, false otherwise
 */
export async function isCompanyVerified(companyId: string): Promise<boolean> {
  try {
    return await validateCompanyVerification(companyId);
  } catch {
    return false;
  }
}
