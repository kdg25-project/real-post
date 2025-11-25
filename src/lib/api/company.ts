export async function getCompanyDetail(companyId: string) {
  try {
    const res = await fetch(`/api/company/${companyId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch company detail");
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
}
