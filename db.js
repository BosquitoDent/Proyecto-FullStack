const { MongoClient } = require("mongodb")

const url = process.env.MONGODB_URL
const dbName = process.env.DB_NAME

const client = new MongoClient(url, { maxPoolSize: 10 })
let db

async function getDb() {
  if (!db) {
    await client.connect()
    console.log("Conectado a MongoDB")
    db = client.db(dbName)
  }
  return db
}

module.exports = { getDb }