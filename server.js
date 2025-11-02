require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cancionesRouter = require("./routes/canciones")
const { getDb } = require("./db")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => res.json({ ok: true }))

app.get("/db/health", async (_req, res) => {
  try {
    const db = await getDb()
    const collections = await db.listCollections().toArray()
    res.json({ ok: true, collections: collections.map(c => c.name) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: "No se pudo conectar a MongoDB" })
  }
})

app.use("/canciones", cancionesRouter)

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})

app.post('/auth/login', (req, res) => {
  const { user, pass } = req.body
  if (user === process.env.LOGIN_USER && pass === process.env.LOGIN_PASS) {
    return res.json({ ok: true, session: 'ok' })
  }
  return res.status(401).json({ ok: false, error: 'Credenciales inválidas' })
})