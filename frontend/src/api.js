const base = import.meta.env.VITE_API_URL

export async function getCanciones(filtros = {}) {
  const params = new URLSearchParams()
  if (filtros.artista) params.set("artista", filtros.artista)
  if (filtros.estadoDeAnimo) params.set("mood", filtros.estadoDeAnimo)
  const url = `${base}/canciones${params.toString() ? "?" + params.toString() : ""}`
  const r = await fetch(url)
  return await r.json()
}

export async function crearCancion(data) {
  const r = await fetch(`${base}/canciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return await r.json()
}

export async function borrarCancion(id) {
  const r = await fetch(`${base}/canciones/${id}`, { method: "DELETE" })
  return await r.json()
}

export async function actualizarCancion(id, data) {
  const r = await fetch(`${base}/canciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return await r.json()
}

export async function login({ user, pass }) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, pass })
  })
  if (!res.ok) throw new Error('Credenciales inválidas')
  return await res.json()
}