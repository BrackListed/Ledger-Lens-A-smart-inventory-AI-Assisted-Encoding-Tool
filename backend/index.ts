import "dotenv/config"
import express from "express"
import cors from "cors"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { clerkMiddleware, getAuth } from "@clerk/express"
import { verifyWebhook } from "@clerk/express/webhooks"
import Groq from "groq-sdk";
// Provide a lightweight declaration for multer to satisfy TypeScript when @types/multer is not installed
import multer from "multer"
import path from "path"
import * as XLSX from "xlsx"
import { materials } from "./db/schema"


const app = express()
const pool = new Pool({connectionString: process.env.DATABASE_URL})
const db = drizzle(process.env.DATABASE_URL!)

// Dynamically handles your local dev or your deployed Render frontend URL
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173"

app.use(cors({
  origin: [allowedOrigin], 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.post("/webhooks/clerk", express.raw({type: "application/json"}), async (req, res) => {
  try{
    const evt = await verifyWebhook(req)
    const eventType = evt.type
    if(eventType === "user.created"){
      const {id, email_addresses, username, first_name} = evt.data as {
        id: string
        email_addresses: Array<{ email_address: string }>
        username?: string | null
        first_name?: string | null
      }
      await pool.query("INSERT INTO users(clerk_user_id, email, username) VALUES($1, $2, $3)", [id, email_addresses[0]?.email_address ?? "", username ?? first_name])
    }
    return res.status(200).send("Webhook Received")
  } catch(err){
    console.error("Error verifying webhook", err)
    return res.status(400).send('Error verifying webhook')
  }
})

app.use(clerkMiddleware())
app.use(express.json())


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const shortName = Date.now() + path.extname(file.originalname);
    cb(null, shortName)
  }
})

const upload = multer({storage: storage})
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
app.post("/create/store", async(req, res) => {
  const {userId} = getAuth(req)
  const result = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const id = result.rows[0]?.id
  await pool.query("INSERT INTO stores(name, user_id) VALUES($1, $2)", [req.body.name, id])
  res.json(true)
})

app.get("/store", async(req, res) => {
  const {userId} = getAuth(req)
  const fetch = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const id = fetch.rows[0]?.id
  if (!id) return res.status(404).json({ error: "User not found" })
  const result = await pool.query("SELECT * FROM stores WHERE user_id = $1", [id])
  res.json(result.rows)
})

app.post("/encode/:storeId", upload.single("file"), async(req, res) => {
  const {userId} = getAuth(req)
  const pending = await pool.query("SELECT id FROM file WHERE store_id = $1 and status = 'Pending'", [req.params.storeId])
  const fetch = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const id = fetch.rows[0]?.id
  if(!id) return res.status(404).json({error: "User not found"})
  if(pending.rows.length > 0) {
    return res.json({message: "You have items on pending. Verify them before adding a new one!", status: false})
  }
  const result = await pool.query("INSERT INTO file(store_id, filename, user_id) VALUES($1, $2, $3) RETURNING id", [req.params.storeId, req.body.name, id])
  const workbook = XLSX.readFile(req.file!.path)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(sheet, {header: 1}) as any[][]
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    response_format: {type: "json_object"},
    messages: [{
      role: "system",
      content: `Map spreadsheet columns to fields. Return JSON only.
      Fields (column number, or null): sku, description, quantity, unit_price
      - sku: item code / product code / SKU
      - description: item description / product name
      - quantity: qty ordered
      - unit_price: price per unit as shown on the invoice
      Shape: {"sku":n,"description":n,"quantity":n,"unit_price":n}
      Only assign a column number if that field clearly exists in the header. If a field has no matching column, set it to null. Do NOT shift or guess — a missing field is null, never a borrowed index.
      The column numbers start from 0`
    },
    {
      role: "user",
      content: JSON.stringify(data[0])
    }
    ],
    temperature: 0
  })
  const raw = completion.choices[0]?.message?.content || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  const columns = JSON.parse(clean)
  const cutoff = data.findIndex(row => !row[columns.sku] && !row[columns.description])
  const rawMaterials = cutoff === -1 ? data.slice(1) : data.slice(1, cutoff)
  const materials = rawMaterials.map((material) => {
    const unitprice = Number(material[columns.unit_price])
    const quantity = Number(material[columns.quantity])
    const total = unitprice * quantity
    return{
      sku: material[columns.sku],
      description: material[columns.description],
      quantity: material[columns.quantity],
      unit_price: material[columns.unit_price],
      total_price: total
    }
  })
  const fileId = result.rows[0]?.id
  const promises = materials.map(async (material) => {
    return pool.query(
      "INSERT INTO materials(sku, description, quantity, unit_price, total_price, store_id, file_id) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [material.sku, material.description, material.quantity, material.unit_price, material.total_price, req.params.storeId, fileId]
    )
  })
  await Promise.all(promises)
  res.json({message: "File successfully sent to encoding", status: true, materials: materials, file: pending.rows})
})

app.post("/encode/sales/:storeId", upload.single("sales"), async(req, res) => {
  const {userId} = getAuth(req)
  const fetch = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const id = fetch.rows[0]?.id
  if (!id) return res.status(404).json({ error: "User not found" })
  const workbook = XLSX.readFile(req.file!.path)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const object = XLSX.utils.sheet_to_json(sheet, {header: 1}) as any[][]
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    response_format: {type: "json_object"},
    messages: [{
      role: "system",
      content: `Map spreadsheet columns to fields. Return JSON only.
      Fields (column number, or null): sku, quantity, sale_price, sale_date
      - sku: item code / product code / SKU
      - quantity: quantity sold
      - sale_price: price per unit at time of sale
      - sale_date: date of the sale
      Shape: {"sku":n,"quantity":n,"sale_price":n,"sale_date":n}
      Only assign a column number if that field clearly exists in the header. If a field has no matching column, set it to null. Do NOT shift or guess — a missing field is null, never a borrowed index.
      The column numbers start from 0`
    },
    {
      role: "user",
      content: JSON.stringify(object[0])
    }
    ],
    temperature: 0
  })
  const raw = completion.choices[0]?.message?.content || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  const columns = JSON.parse(clean)
  const cutoff = object.findIndex(sample => !sample[columns.sale_price] && !sample[columns.sale_date])
  const rawSales = object.slice(1, cutoff)
  const sales = rawSales.map((sales) => {
    const price = sales[columns.sale_price]
    const quantity = sales[columns.quantity]
    const total = Number(price) * Number(quantity)
    return {
      sku: sales[columns.sku],
      quantity: sales[columns.quantity],
      sale_price: sales[columns.sale_price],
      sale_date: sales[columns.sale_date],
      total: total
    }
  })
  res.json(sales)
})

app.post("/confirm/sales/:storeId", async(req, res) => {
  const sales = req.body.sales
  for(const sale of sales){
    await pool.query("UPDATE materials SET quantity = quantity - $1 WHERE store_id = $2 AND sku = $3", [Number(sale.quantity), req.params.storeId, sale.sku ])
  }
  res.json(true)
})

app.get("/store", async(req, res) => {
  const {userId} = getAuth(req)
  const fetch = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const id = fetch.rows[0]?.id
  const store = await pool.query("SELECT * FROM stores WHERE user_id = $1", [id])
  res.json(store.rows)
})

app.get("/materials/:storeId", async(req, res) => {
  const result = await pool.query("SELECT materials.* FROM materials JOIN file on materials.file_id = file.id WHERE materials.store_id = $1 AND file.status = 'Pending'", [req.params.storeId])
  const file = await pool.query("SELECT * FROM file WHERE store_id = $1 AND status = $2", [req.params.storeId, 'Pending'])
  res.json({materials: result.rows, file: file.rows})
})

app.get("/completed/:storeId", async(req, res) => {
  const file = await pool.query("SELECT * FROM file WHERE store_id = $1 AND status = $2", [req.params.storeId, 'Confirmed'])
  const materials = await pool.query("SELECT materials.* FROM materials JOIN file ON materials.file_id = file.id WHERE materials.store_id = $1 AND file.status = 'Confirmed'", [req.params.storeId])
  res.json({materials: materials.rows, files: file.rows})
})

app.patch("/confirm/:fileId", async(req, res) => {
  await pool.query("UPDATE file SET status = $1 WHERE id = $2", ['Confirmed', req.params.fileId])
  res.json(true)
})

app.delete("/delete/materials/:materialId/:storeId", async(req, res) => {
  await pool.query("DELETE FROM materials WHERE id = $1 AND store_id = $2", [req.params.materialId, req.params.storeId])
  res.json(true)
})

app.delete("/delete/file/:fileId/:storeId", async(req, res) => {
  await pool.query("DELETE FROM file WHERE id = $1 and store_id = $2", [req.params.fileId, req.params.storeId])
  res.json(true)
})



const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
