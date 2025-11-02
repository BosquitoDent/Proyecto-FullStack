const { Router } = require("express")
const { ObjectId } = require("mongodb")
const { getDb } = require("../db")

const router = Router()

router.get("/", async (req, res) => {
  try {
    const { artista, mood, desde, hasta } = req.query

    const db = await getDb()
    const col = db.collection("canciones")

    const query = {}
    if (artista) query.artista = { $regex: artista, $options: "i" }
    if (mood) query.estadoDeAnimo = mood
    if (desde || hasta) {
      query.fecha = {}
      if (desde) query.fecha.$gte = new Date(desde)
      if (hasta) query.fecha.$lte = new Date(hasta)
    }

    const docs = await col.find(query).sort({ fecha: -1 }).toArray()
    res.json(docs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "No se pudo leer canciones" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: "ID no válido" })

    const db = await getDb()
    const col = db.collection("canciones")
    const doc = await col.findOne({ _id: new ObjectId(id) })
    if (!doc) return res.status(404).json({ error: "No existe esa canción" })

    res.json(doc)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "No se pudo leer la canción" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { titulo, artista, estadoDeAnimo, fecha } = req.body || {}
    if (!titulo || !artista) {
      return res.status(400).json({ error: "Los campos 'titulo' y 'artista' son obligatorios" })
    }

    const db = await getDb()
    const col = db.collection("canciones")

    const doc = {
      titulo,
      artista,
      estadoDeAnimo: estadoDeAnimo ?? null,
      fecha: fecha ? new Date(fecha) : new Date()
    }

    const result = await col.insertOne(doc)
    const creado = await col.findOne({ _id: result.insertedId })
    res.status(201).json({ message: "Canción creada", data: creado })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID no válido" })
    }

    const { titulo, artista, estadoDeAnimo, fecha } = req.body || {}
    if (!titulo || !artista) {
      return res.status(400).json({ error: "Los campos 'titulo' y 'artista' son obligatorios" })
    }

    const db = await getDb()
    const col = db.collection("canciones")

    const setData = {
      titulo,
      artista,
      estadoDeAnimo: estadoDeAnimo ?? null,
      fecha: fecha ? new Date(fecha) : new Date()
    }

    const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: setData })
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "No existe esa canción" })
    }

    const actualizado = await col.findOne({ _id: new ObjectId(id) })
    res.json({ message: "Canción actualizada", data: actualizado })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "No se pudo actualizar la canción" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: "ID no válido" })

    const db = await getDb()
    const col = db.collection("canciones")
    const result = await col.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) return res.status(404).json({ error: "No existe esa canción" })
    res.json({ message: "Canción eliminada" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "No se pudo eliminar la canción" })
  }
})

module.exports = router