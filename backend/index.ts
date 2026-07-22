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
    res.json({message: "You have items on pending. Verify them before adding a new one!", status: false})
    return res.status(409).json({ error: "You have items on pending!"})
  }
  const result = await pool.query("INSERT INTO file(store_id, filename, user_id) VALUES($1, $2, $3)", [req.params.storeId, req.body.name, id])
  const workbook = XLSX.readFile(req.file!.path)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(sheet, {header: 1}) as any[][]
  const sheetText = data.map(row => row.join('\t')).join('\n')
  console.log(sheetText)
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
      content: sheetText
    }
    ],
    temperature: 0
  })
  res.json({message: "File successfully sent to encoding", file: result.rows, status: true, sheetText: sheetText, data: data})
})



const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
