import { useEffect, useState } from "react"
import { getCanciones, crearCancion, borrarCancion, actualizarCancion } from "../api"
import { useNavigate } from "react-router-dom"
import Toast from "../components/Notificaciones"
import Popup from "../components/Notificaciones"

export default function Canciones() {
  const [lista, setLista] = useState([])
  const [titulo, setTitulo] = useState("")
  const [artista, setArtista] = useState("")
  const [estadoDeAnimo, setMood] = useState("")

  const [fArtista, setFArtista] = useState("")
  const [fMood, setFMood] = useState("")



  const [editId, setEditId] = useState(null)
  const [editTitulo, setEditTitulo] = useState("")
  const [editArtista, setEditArtista] = useState("")
  const [editMood, setEditMood] = useState("")

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  const [mensaje, setMensaje] = useState("")
  const [enviando, setEnviando] = useState(false)

  const nav = useNavigate()

  async function cargar(filtros = {}) {
    try {
      setError("")
      setCargando(true)

      const data = await getCanciones(filtros)


      setLista(Array.isArray(data.items) ? data.items : data)
    } catch (e) {
      setError("No se pudieron cargar las canciones")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  async function crear(e) {
    e.preventDefault()
    if (!titulo || !artista) return
    try {
      setError("")
      setEnviando(true)

      await crearCancion({ titulo, artista, estadoDeAnimo })
      mostrarMensaje("Canción añadida correctamente 🎵")

      setTitulo("")
      setArtista("")
      setMood("")
      cargar({
        rtista: fArtista,
        estadoDeAnimo: fMood
      })
    } catch (e) {

      setError("No se pudo crear la canción")
    } finally {

      setEnviando(false)
    }
  }

  async function borrar(id) {
    try {
      setError("")
      setEnviando(true)

      await borrarCancion(id)

      mostrarMensaje("Canción eliminada 🗑️")
      cargar({
        artista: fArtista,
        estadoDeAnimo: fMood
      })
    } catch (e) {
      setError("No se pudo eliminar la canción")
    } finally {

      setEnviando(false)
    }
  }

  function empezarEditar(c) {
    setEditId(c._id)
    setEditTitulo(c.titulo)
    setEditArtista(c.artista)
    setEditMood(c.estadoDeAnimo || "")
  }

  async function guardarEdicion(id) {
    if (!editTitulo || !editArtista) return
    try {

      setError("")
      setEnviando(true)

      await actualizarCancion(id, {
        titulo: editTitulo,
        artista: editArtista,
        estadoDeAnimo: editMood || null
      })

      mostrarMensaje("Cambios guardados ✅")

      cancelarEdicion()
      cargar({ artista: fArtista, estadoDeAnimo: fMood })
    } catch (e) {

      setError("No se pudo actualizar la canción")

    } finally {

      setEnviando(false)

    }
  }

  function cancelarEdicion() {
    setEditId(null)
    setEditTitulo("")
    setEditArtista("")
    setEditMood("")
  }

  function aplicarFiltros(e) {
    e.preventDefault()
    cargar({ artista: fArtista, estadoDeAnimo: fMood })
  }

  function salir() {
    localStorage.removeItem("session")
    nav("/login")
  }

  function mostrarMensaje(texto) {
    setMensaje(texto)
    setTimeout(() => setMensaje(""), 2000)
  }

  return (
    <>
      <Popup message={mensaje} />

      <div className="container">
        <div className="header">
          <div className="title">MoodSound</div>
          <button className="btn btn-ghost" onClick={salir}>Salir</button>
        </div>

        <div className="card">
          <div className="section-title">Añadir canción</div>
          <form onSubmit={crear} className="row add">
            <input className="input" placeholder="título" value={titulo} onChange={e => setTitulo(e.target.value)} />
            <input className="input" placeholder="artista" value={artista} onChange={e => setArtista(e.target.value)} />
            <input className="input" placeholder="mood" value={estadoDeAnimo} onChange={e => setMood(e.target.value)} />
            <button className="btn btn-primary" type="submit" disabled={enviando}>
              {enviando ? "Añadiendo..." : "Añadir"}
            </button>
          </form>
          <div className="help">Rellena título, artista y el estado de ánimo</div>
        </div>

        <div className="card">
          <div className="section-title">Buscar canciones</div>
          <form onSubmit={aplicarFiltros} className="row filters">
            <input className="input" placeholder="filtrar por artista" value={fArtista} onChange={e => setFArtista(e.target.value)} />
            <input className="input" placeholder="filtrar por mood" value={fMood} onChange={e => setFMood(e.target.value)} />
            <button className="btn" type="submit">Filtrar</button>
          </form>

          <div className="divider" />

          {cargando && <div className="help">Cargando canciones…</div>}
          {error && <div className="help" style={{ color: "#ff9b9b" }}>{error}</div>}
          {mensaje && <div className="help" style={{ color: "#7df0c0" }}>{mensaje}</div>}
          {!cargando && lista.length === 0 && <div className="help">No hay canciones. Añade la primera o cambia los filtros.</div>}

          <div className="table">
            {lista.map(c => (
              <div key={c._id} className="tr">
                {editId === c._id ? (
                  <>
                    <input className="input" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} />
                    <input className="input" value={editArtista} onChange={e => setEditArtista(e.target.value)} />
                    <input className="input" value={editMood} onChange={e => setEditMood(e.target.value)} />
                    <div className="actions">
                      <button className="btn btn-ok" disabled={enviando} onClick={() => guardarEdicion(c._id)}>Guardar</button>
                      <button type="button" className="btn" onClick={cancelarEdicion}>Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>{c.titulo}</div>
                    <div>{c.artista}</div>
                    <div><span className="badge">{c.estadoDeAnimo || "—"}</span></div>
                    <div className="actions">
                      <button className="btn" disabled={enviando} onClick={() => empezarEditar(c)}>Editar</button>
                      <button className="btn btn-danger" disabled={enviando} onClick={() => borrar(c._id)}>Eliminar</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )

}
