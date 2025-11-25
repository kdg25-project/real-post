export async function toggleFavorite(surveyId: string) {
  try {
    const res = await fetch(`/api/surveys/${surveyId}/favorite`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to toggle favorite: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
