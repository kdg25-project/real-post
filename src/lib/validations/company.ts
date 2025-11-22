import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";

export class CompanyNotFoundError extends Error {
  constructor(message = "Company not found") {
    super(message);
    this.name = "CompanyNotFoundError";
  }
}

export class CompanyNotVerifiedError extends Error {
  constructor(message = "Company must be verified") {
    super(message);
    this.name = "CompanyNotVerifiedError";
  }
}

/**
 * Validates if a company exists and is verified
 * @param companyId - The UUID of the company to validate
 * @returns true if company is verified, false otherwise
 * @throws CompanyNotFoundError if company doesn't exist
 */
export async function validateCompanyVerification(companyId: string): Promise<boolean> {
  const company = await db
    .select({ verified: companies.verified })
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (company.length === 0) {
    throw new CompanyNotFoundError();
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
