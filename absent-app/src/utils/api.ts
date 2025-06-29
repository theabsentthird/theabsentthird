// src/utils/api.ts
const baseURL = import.meta.env.VITE_API_BASE_URL;

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${baseURL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}
