import "dotenv/config"
import express from "express"
import cors from "cors"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { clerkClient, clerkMiddleware, getAuth } from "@clerk/express"
import { verifyWebhook } from "@clerk/express/webhooks"
import Groq from "groq-sdk";
// Provide a lightweight declaration for multer to satisfy TypeScript when @types/multer is not installed
import multer from "multer"
import path from "path"
import * as XLSX from "xlsx"
import { materials } from "./db/schema"
const { randomUUID } = require('crypto')

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
app.use(express.json({limit: "10mb"}))


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

// Falls back to provisioning the user row here in case the Clerk webhook
// (which normally inserts it on user.created) never fired, e.g. in local dev
// without a webhook tunnel configured.
async function getOrCreateUserId(userId: string){
  const existing = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  if(existing.rows[0]?.id) return existing.rows[0].id as string
  const clerkUser = await clerkClient.users.getUser(userId)
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? ""
  const username = clerkUser.username ?? clerkUser.firstName ?? userId
  const inserted = await pool.query(
    "INSERT INTO users(clerk_user_id, email, username) VALUES($1, $2, $3) RETURNING id",
    [userId, email, username]
  )
  return inserted.rows[0].id as string
}

app.post("/create/store", async(req, res) => {
  const {userId} = getAuth(req)
  if(!userId) return res.status(401).json({message: "Not authenticated"})
  const id = await getOrCreateUserId(userId)
  await pool.query("INSERT INTO stores(name, user_id) VALUES($1, $2)", [req.body.name, id])
  res.json(true)
})

app.get("/store", async(req, res) => {
  const {userId} = getAuth(req)
  if(!userId) return res.status(401).json({message: "Not authenticated"})
  const id = await getOrCreateUserId(userId)
  const result = await pool.query("SELECT * FROM stores WHERE user_id = $1", [id])
  res.json(result.rows)
})

app.patch("/store/:storeId", async(req, res) => {
  await pool.query("UPDATE stores SET name = $1 WHERE id = $2", [req.body.name, req.params.storeId])
  res.json({message: "Store renamed successfully!", status: true})
})

app.delete("/store/:storeId", async(req, res) => {
  await pool.query("DELETE FROM stores WHERE id = $1", [req.params.storeId])
  res.json({message: "Store deleted successfully!", status: true})
})

app.post("/encode/:storeId", upload.single("file"), async(req, res) => {
  const {userId} = getAuth(req)
  if(!userId) return res.status(401).json({message: "Not authenticated"})
  const pending = await pool.query("SELECT id FROM file WHERE store_id = $1 AND status = 'Pending' AND type = 'Materials'", [req.params.storeId])
  const id = await getOrCreateUserId(userId)
  if(pending.rows.length > 0) {
    return res.json({message: "You have items on pending. Verify them before adding a new one!", status: false})
  }
  const result = await pool.query("INSERT INTO file(store_id, filename, user_id, type) VALUES($1, $2, $3, $4) RETURNING id", [req.params.storeId, req.body.name, id, "Materials",])
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
  if(!userId) return res.status(401).json({message: "Not authenticated"})
  const pending = await pool.query("SELECT id FROM file WHERE store_id = $1 AND status = 'Pending' AND type = 'Sales'", [req.params.storeId])
  const id = await getOrCreateUserId(userId)
  if(pending.rows.length > 0) {
    return res.json({message: "You have sales on pending. Verify them before adding a new one!", status: false})
  }
  const workbook = XLSX.readFile(req.file!.path)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const object = XLSX.utils.sheet_to_json(sheet, {header: 1}) as any[][]
  const result = await pool.query("INSERT INTO file(store_id, filename, user_id, type) VALUES($1, $2, $3, $4) RETURNING id", [req.params.storeId, req.body.name, id, "Sales"])
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
  const rawSales = cutoff === -1 ? object.slice(1) : object.slice(1, cutoff)
  const sales = rawSales.map((sales) => {
    const price = sales[columns.sale_price]
    const quantity = sales[columns.quantity]
    const total = Number(price) * Number(quantity)
    return {
      id: randomUUID(),
      sku: sales[columns.sku],
      quantity: sales[columns.quantity],
      sale_price: sales[columns.sale_price],
      sale_date: sales[columns.sale_date],
      total: total
    }
  })
  for(const sale of sales){
    const date = typeof sale.sale_date === "number" ? new Date((sale.sale_date - 25569) * 86400000) : new Date(sale.sale_date)
    await pool.query("UPDATE materials SET quantity = quantity - $1 WHERE store_id = $2 AND sku = $3", [Number(sale.quantity), req.params.storeId, sale.sku ])
    await pool.query("INSERT INTO sales(id, store_id, sale_date, sku, quantity, sale_price, total, file_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [sale.id, req.params.storeId, date, sale.sku, sale.quantity, sale.sale_price, sale.total, result.rows[0].id])
  }
  res.json({sales: sales, id: result.rows[0].id, message: "Successfully encoded sales", status: true})
})

app.post("/confirm/sales/:fileId", async(req, res) => {
  await pool.query("UPDATE file SET status = $1 WHERE id = $2", ["Confirmed", req.params.fileId])
  res.json({status: true, message: "Materials forwarded to store successfully"})
})

app.get("/materials/:storeId", async(req, res) => {
  const result = await pool.query("SELECT materials.* FROM materials JOIN file on materials.file_id = file.id WHERE materials.store_id = $1 AND file.status = 'Pending'", [req.params.storeId])
  const file = await pool.query("SELECT * FROM file WHERE store_id = $1 AND status = $2 AND type = $3", [req.params.storeId, 'Pending', 'Materials'])
  res.json({materials: result.rows, file: file.rows})
})


app.get("/completed/:storeId", async(req, res) => {
  const materialFiles = await pool.query("SELECT * FROM file WHERE store_id = $1 AND status = $2 AND type = $3", [req.params.storeId, 'Confirmed', 'Materials'])
  const saleFiles = await pool.query("SELECT * FROM file WHERE store_id = $1 AND status = $2 AND type = $3", [req.params.storeId, 'Confirmed', 'Sales'])
  const materials = await pool.query("SELECT materials.* FROM materials JOIN file ON materials.file_id = file.id WHERE materials.store_id = $1 AND file.status = 'Confirmed'", [req.params.storeId])
  const sales = await pool.query("SELECT sales.* FROM sales JOIN file ON sales.file_id = file.id WHERE sales.store_id = $1 AND file.status = 'Confirmed'", [req.params.storeId])
  res.json({materials: materials.rows, materialFiles: materialFiles.rows, saleFiles: saleFiles.rows, sales: sales.rows})
})


app.get("/sales/:storeId", async(req, res) => {
  const sales = await pool.query("SELECT sales.* FROM sales JOIN file ON sales.file_id = file.id WHERE sales.store_id = $1 AND file.status = 'Pending'", [req.params.storeId])
  const file = await pool.query("SELECT * FROM file WHERE store_id = $1 AND status = $2 AND type = $3", [req.params.storeId, 'Pending', 'Sales'])
  res.json({sales: sales.rows, file: file.rows})
})

app.get("/summary/:storeId", async(req, res) => {
  const storeId = req.params.storeId

  const revenueResult = await pool.query(
    "SELECT COALESCE(SUM(total), 0) AS revenue FROM sales WHERE store_id = $1",
    [storeId]
  )
  const cogsResult = await pool.query(
    `SELECT COALESCE(SUM(sales.quantity * materials.unit_price), 0) AS cogs
     FROM sales
     JOIN materials ON sales.sku = materials.sku AND sales.store_id = materials.store_id
     WHERE sales.store_id = $1`,
    [storeId]
  )
  const inventoryResult = await pool.query(
    "SELECT COALESCE(SUM(total_price), 0) AS inventory_value FROM materials WHERE store_id = $1",
    [storeId]
  )
  const topSellersResult = await pool.query(
    `SELECT materials.sku, materials.description, SUM(sales.quantity) AS quantity_sold
     FROM sales
     JOIN materials ON sales.sku = materials.sku AND sales.store_id = materials.store_id
     WHERE sales.store_id = $1
     GROUP BY materials.sku, materials.description
     ORDER BY quantity_sold DESC
     LIMIT 5`,
    [storeId]
  )
  const priceSpikeResult = await pool.query(
    "SELECT COUNT(*) FROM materials JOIN stores ON materials.store_id = stores.id WHERE materials.store_id = $1 AND materials.unit_price > materials.preset_price * (1 + stores.price_spike / 100)",
    [storeId]
  )
  const marginLossResult = await pool.query(
    "SELECT COUNT(*) FROM materials JOIN stores on materials.store_id = stores.id JOIN sales on sales.sku = materials.sku AND sales.store_id = stores.id WHERE materials.store_id = $1 AND sales.sale_price <= materials.unit_price * (1 - stores.margin_floor / 100)",
    [storeId]
  )
  const stockMismatchResult = await pool.query(
    "SELECT COUNT(*) FROM materials WHERE materials.store_id = $1 AND materials.quantity < 0",
    [storeId]
  )

  const revenue = Number(revenueResult.rows[0].revenue)
  const cogs = Number(cogsResult.rows[0].cogs)
  const anomaliesFlagged =
    Number(priceSpikeResult.rows[0].count) +
    Number(marginLossResult.rows[0].count) +
    Number(stockMismatchResult.rows[0].count)

  res.json({
    revenue,
    profit: revenue - cogs,
    inventoryValue: Number(inventoryResult.rows[0].inventory_value),
    anomaliesFlagged,
    topSellers: topSellersResult.rows.map((row) => ({
      sku: row.sku,
      description: row.description,
      quantitySold: Number(row.quantity_sold),
    })),
  })
})

app.get("/trend/sales/:storeId", async(req, res) => {
  const result = await pool.query(
    `SELECT DATE_TRUNC('month', sale_date) AS month, SUM(total) AS revenue
     FROM sales
     WHERE store_id = $1
     GROUP BY month
     ORDER BY month`,
    [req.params.storeId]
  )
  res.json(result.rows)
})

app.get("/trend/materials/:storeId", async(req, res) => {
  const result = await pool.query(
    `SELECT DATE_TRUNC('month', purchased_at) AS month, SUM(total_price) AS cost
     FROM materials
     WHERE store_id = $1
     GROUP BY month
     ORDER BY month`,
    [req.params.storeId]
  )
  res.json(result.rows)
})

app.get("/flagged/pricespike/:storeId", async(req, res) => {
  const materials = await pool.query("SELECT materials.* FROM materials JOIN stores ON materials.store_id = stores.id WHERE materials.store_id = $1 AND materials.unit_price > materials.preset_price * (1 + stores.price_spike / 100)", [req.params.storeId])
  res.json(materials.rows)
})

app.get("/flagged/marginloss/:storeId", async(req, res) => {
  const materials = await pool.query("SELECT materials.*, sales.sale_price FROm materials JOIN stores on materials.store_id = stores.id JOIN sales on sales.sku = materials.sku AND sales.store_id = stores.id WHERE materials.store_id = $1 AND sales.sale_price <= materials.unit_price * (1 - stores.margin_floor / 100)", [req.params.storeId])
  res.json(materials.rows)

})

app.get("/flagged/stockmismatch/:storeId", async(req, res) => {
  const materials = await pool.query("SELECT materials.* FROM materials WHERE materials.store_id = $1 AND materials.quantity < 0", [req.params.storeId])
  res.json(materials.rows)
})



app.patch("/confirm/:fileId", async(req, res) => {
  await pool.query("UPDATE file SET status = $1 WHERE id = $2", ['Confirmed', req.params.fileId])
  res.json(true)
})

app.patch("/update/material/:materialId", async(req, res) => {
  if(req.body.price){
    const preset = req.body.price
    const material = await pool.query("SELECT unit_price FROM materials WHERE id = $1", [req.params.materialId])
    const unit = material.rows[0].unit_price
    const profitMargin = ((Number(unit) - Number(preset)) / Number(preset)) * 100
    await pool.query("UPDATE materials SET preset_price = $1 WHERE id = $2", [req.body.price, req.params.materialId])
    await pool.query("UPDATE materials SET profit_margin = $1 WHERE id = $2", [profitMargin, req.params.materialId])
    res.json({message: "Price updated successfully!", status: true})
  } else if(req.body.sku){
    await pool.query("UPDATE materials SET sku = $1 WHERE id = $2", [req.body.sku, req.params.materialId])
    res.json({message: "SKU updated successfully!", status: true})
  } else if(req.body.description){
    await pool.query("UPDATE materials SET description = $1 WHERE id = $2", [req.body.description, req.params.materialId])
    res.json({message: "Description updated successfully!", status: true})
  }
})

app.patch("/set/thresholds/:storeId", async(req, res) => {
  if(req.body.spike){
    await pool.query("UPDATE stores SET price_spike = $1 WHERE id = $2", [req.body.spike, req.params.storeId])
    res.json({message: "Price jump spike successfully set!", status: true})
  } else if(req.body.floor){
    await pool.query("UPDATE stores SET margin_floor = $1 WHERE id = $2", [req.body.floor, req.params.storeId])
    res.json({message: "Margin loss floor successfully set!", status: true})
  }else if(req.body.mismatch){
    await pool.query("UPDATE stores SET mismatch = $1 WHERE id = $2", [req.body.mismatch, req.params.storeId])
    res.json({message: "Mismatch Variance successfully set!", status: true})
  }
})


app.patch("/encode/preset/:storeId", upload.single("preset"), async(req, res) => {
  const workbook = XLSX.readFile(req.file!.path)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(sheet, {header: 1}) as any[][]
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    response_format: {type: "json_object"},
    messages: [{
      role: "system",
      content: `Map spreadsheet columns to fields. Return JSON only.
      Fields (column number, or null): sku, preset_price
      - sku: item code / product code / SKU
      - preset_price: the preset / target price per unit
      Shape: {"sku":n,"preset_price":n}
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
  const cutoff = data.findIndex(row => !row[columns.sku] && !row[columns.preset_price])
  const rawPresets = cutoff === -1 ? data.slice(1) : data.slice(1, cutoff)
  const presets = rawPresets.map((row) => ({
    sku: row[columns.sku],
    preset_price: row[columns.preset_price],
  }))
  const promises = presets.map((preset) =>
    pool.query(
      "UPDATE materials SET preset_price = $1, profit_margin = ((unit_price - $1) / $1) * 100 WHERE store_id = $2 AND sku = $3",
      [preset.preset_price, req.params.storeId, preset.sku]
    )
  )
  await Promise.all(promises)
  res.json({message: "Preset prices updated successfully", status: true, presets: presets})
})

app.delete("/delete/materials/:materialId/:storeId", async(req, res) => {
  await pool.query("DELETE FROM materials WHERE id = $1 AND store_id = $2", [req.params.materialId, req.params.storeId])
  res.json(true)
})

app.delete("/delete/file/:fileId/:storeId", async(req, res) => {
  await pool.query("DELETE FROM file WHERE id = $1 and store_id = $2", [req.params.fileId, req.params.storeId])
  res.json(true)
})




app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  if(res.headersSent) return next(err)
  res.status(500).json({message: "Internal server error", status: false})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
