// export interface SurveyQueryParams {
//     page: number;
//     limit: number;
//     category?: "food" | "culture" | "activity" | "shopping" | "other";
//     query?: string;
//     age_group?: "18-24" | "25-34" | "35-44" | "45-54" | "55+";
//     country?: string;
//     gender?: "male" | "female" | "other";
// }

// export async function fetchSurveys(params: SurveyQueryParams) {
//     const query = new URLSearchParams();

//     if (params.category) query.set("category", params.category);
//     if (params.query) query.set("query", params.query);
//     if (params.age_group) query.set("age_group", params.age_group);
//     if (params.country) query.set("country", params.country);
//     if (params.gender) query.set("gender", params.gender);

//     const res = await fetch(`/api/surveys?${query.toString()}`, {
//         method: "GET",
//     });

//     if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || "Failed to fetch surveys");
//     }

//     return res.json();
// }

// // 呼び出しれい
// // import { fetchSurveys } from "@/lib/api/survey-post";

// // const result = await fetchSurveys({
// //   page: 1,
// //   limit: 20,
// //   category: "food",
// //   age_group: "18-24",
// // });