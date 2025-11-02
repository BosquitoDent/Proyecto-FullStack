import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError("")
    if (!email || !pass) return setError("Rellena usuario y contraseña")
    try {
      setCargando(true)
      if (email === "admin@music.com" && pass === "1234") {
        localStorage.setItem("session", "ok")
        nav("/")
      } else {
        setError("Credenciales inválidas")
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth-card card">
        <div className="brand">MoodSound</div>
        <div className="subtitle">Introduce tu usuario y tu contraseña</div>
        <form onSubmit={submit} className="auth-form">
          <input
            className="input"
            placeholder="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="contraseña"
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={cargando}>
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-foot">
          <span className="muted">Usuario demo:</span> admin@music.com · 1234
        </div>
      </div>
    </div>
  )
}