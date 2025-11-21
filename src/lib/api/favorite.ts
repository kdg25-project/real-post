const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function toggleFavorite(surveyId: string) {
    try {
        const res = await fetch(`${BASE_URL}/surveys/${surveyId}/favorite`, {
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

