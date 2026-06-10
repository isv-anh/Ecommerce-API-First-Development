export async function bootstrapAuth() {
  const response = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return data.accessToken;
}
