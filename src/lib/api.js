const defaultBase = import.meta.env.PROD ? '' : 'http://127.0.0.1:3000';
export const API_BASE = import.meta.env.VITE_API_BASE || defaultBase;

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

  if (!res.ok || (data && data.error)) {
    const err = new Error(data?.error || `Error ${res.status}: ${res.statusText}`);
    Object.assign(err, data || {});
    throw err;
  }
  return data;
}
