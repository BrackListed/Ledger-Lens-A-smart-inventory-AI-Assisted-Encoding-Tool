# Ledger Lens 🔍

> **Automated inventory audit and profit protection for high-volume ledger data.**

[![Demo Video](https://img.shields.io/badge/WATCH-DEMO_VIDEO-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=IMF-CELzX3I)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=000000)](#)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](#)
[![Groq](https://img.shields.io/badge/Groq-F05A28?style=for-the-badge&logo=groq&logoColor=white)](#)

![Ledger Lens Dashboard Overview](./frontend/src/assets/dashboard-hero.png)

## 📌 Overview
Ledger Lens eliminates manual ledger auditing by processing thousands of material and sales line items in seconds. It automatically flags hidden supplier price spikes, negative margin sales, and inventory stock mismatches before they eat into business profitability.

---

## ✨ Key Features

### 📊 Real-Time Financial Dashboard & Upload
* **Batch Encoding:** Upload Excel (`.xlsx`, `.csv`) invoice sheets to encode materials and sales directly into selected stores.
* **Executive Metrics:** Live tracking of **Revenue, Profit, Inventory Value,** and total **Anomalies Flagged**.
* **Visual Analytics:** Profit trends plotted over time alongside top 5 selling materials.

![Dashboard Analytics](./frontend/src/assets/dashboard-analytics.png)

### 🚨 Automated Anomaly Engine
* **Price Spikes:** Automatically detects material costs that exceed expected preset prices.
* **Margin Loss:** Highlights materials sold at a loss compared to their purchase cost.
* **Stock Mismatch:** Identifies inventory items where sold units exceed recorded stock levels.

![Anomaly Reports](./frontend/src/assets/anomaly-reports.png)

### ⚙️ Thresholds & Store Management
* **Custom Alert Rules:** Set custom thresholds for Price Spikes, Margin Loss, and Stock Mismatch to hide non-critical noise.
* **Bulk Preset Sheets:** Upload master cost sheets by SKU to auto-assign preset baseline prices across materials.

---

## 🛠️ Tech Stack
* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database & ORM:** PostgreSQL, Drizzle ORM
* **Authentication:** Clerk
* **Inference Engine:** Groq API