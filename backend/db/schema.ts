import { pgTable, uuid, text, timestamp, numeric, serial, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").default("").unique(),
    username: text("username").notNull(),
    createdAt: timestamp("created_at",{withTimezone:true}).defaultNow().notNull()
})

export const stores = pgTable("stores", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text('name'),
    created_at: timestamp("created_at", {withTimezone: true}).defaultNow().notNull()
})

export const materials = pgTable("materials", {
    id: serial('id').primaryKey(),
    store_id: uuid("store_id").references(() => stores.id, {onDelete: "cascade"}),
    sku: text('sku'),
    description: text("description"),
    quantity: integer("quantity"),
    unit_price: numeric("unit_price"),
    preset_price: numeric("preset_price"),
    total_price: numeric("total_price"),
    profit_margin: numeric("profit_margin"),
    status: text("status").default("Verified"),
    purchased_at: timestamp("purchased_at", {withTimezone: true}).defaultNow().notNull()
})

export const sales = pgTable("sales", {
    id: serial('id').primaryKey(),
    store_id: uuid("store_id").references(() => stores.id, {onDelete: "cascade"}),
    material_id: integer("material_id").references(() => materials.id, {onDelete: "cascade"}),
    quantity: integer("quantity"),
    sale_price: numeric("sale_price"),
    sale_date: timestamp("sale_date", {withTimezone: true}).defaultNow().notNull()
})

export const file = pgTable("file", {
    id: serial("id").primaryKey(),
    store_id: uuid("store_id").references(() => stores.id, {onDelete: "cascade"}),
    filename: text('filename'),
    upload_date: timestamp("upload_date", {withTimezone: true}).defaultNow().notNull(),
    status: text('status', {enum: ['Pending', 'Confirmed']}).default('Pending')
})

export const storesRelations = relations(stores, ({ many }) => ({
    materials: many(materials),
    sales: many(sales),
    files: many(file)
}))

export const materialsRelations = relations(materials, ({ one, many }) => ({
    store: one(stores, {
        fields: [materials.store_id],
        references: [stores.id]
    }),
    sales: many(sales)
}))

export const salesRelations = relations(sales, ({ one }) => ({
    store: one(stores, {
        fields: [sales.store_id],
        references: [stores.id]
    }),
    material: one(materials, {
        fields: [sales.material_id],
        references: [materials.id]
    })
}))

export const fileRelations = relations(file, ({ one }) => ({
    store: one(stores, {
        fields: [file.store_id],
        references: [stores.id]
    })
}))