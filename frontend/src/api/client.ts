const BASE_URL = import.meta.env.VITE_API_URL as string;

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new ApiRequestError(res.status, body.error ?? res.statusText);
  }

  const json = await res.json() as { data: T };
  return json.data;
}
