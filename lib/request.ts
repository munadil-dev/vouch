class ApiError extends Error {}

/** JSON request to our API routes. Throws with the route's `message` on a non-2xx status. */
export async function request<T = { message: string }>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message ?? "");
  }

  return data;
}

/** The API's error message, or `fallback` for network errors and anything else. */
export function errorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError && err.message ? err.message : fallback;
}
