import "dotenv/config"
import express from "express"
import cors from "cors"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { clerkMiddleware, getAuth } from "@clerk/express"
import { verifyWebhook } from "@clerk/express/webhooks"

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


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
