"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSurveysFromDB } from "@/lib/db/surveys";

export async function loadMoreSurveys(
  page: number,
  query?: string,
  filters?: {
    ageGroups: string[];
    countries: string[];
  },
) {
  // Get session directly in Server Action
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id ?? null;

  // Call DB function directly instead of API route
  const data = await getSurveysFromDB({
    page,
    limit: 3,
    query: query || null,
    ageGroups: filters?.ageGroups || null,
    countries: filters?.countries || null,
    genders: null,
    category: null,
    userId, // This will properly set isFavorited
  });

  return data;
}
