export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function api(path, { method = 'GET', body, token } = {}) {
  const authToken = token || localStorage.getItem('auth_token');
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { error: text || res.statusText };
  }

  if (!res.ok) {
    const err = new Error(data.error || `Error ${res.status}: ${res.statusText}`);
    Object.assign(err, data);
    throw err;
  }
  return data;
}
