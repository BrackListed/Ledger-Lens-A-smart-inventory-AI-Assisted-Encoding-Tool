import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    ChevronDown,
    Filter,
    ShieldAlert,
    Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Header } from "../assets/Header";
import { ChartLineInteractive } from "#components/ChartLineInteractive";
import { api } from "#lib/api";
import { useAuth } from "@clerk/react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const pageFade: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.04,
        },
    },
}

const cardRise: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

type ReportTab = "all" | "price spike" | "margin loss" | "stock mismatch";

export function AnomalyReports() {
    interface storeType{
        created_at: string
        id: string
        name: string
        user_id: string
        price_spike: number
        margin_floor: number
        mismatch: number
    }
    interface materialType{
        id: number
        file_id: number
        store_id: string
        description: string
        preset_price: number
        profit_margin: number
        purchased_at: string
        quantity: number
        sku: string
        status: string
        total_price: number
        unit_price: number
    }


    interface salesType{
        id: string
        date: string
        sku: string
        quantity: number
        sale_price: number
        total: number
    }
    const {getToken} = useAuth()
    const [activeTab, setActiveTab] = useState<ReportTab>("all");
    const [stores, setStores] = useState<storeType[]>([])
    const [selectedStore, setSelectedStore] = useState<storeType | undefined>(undefined)
    const [sales, setSales] = useState<salesType[]>([])
    const [storeDropdownOpen, setStoreDropdownOpen] = useState(false)
    const storeDropdownRef = useRef<HTMLDivElement>(null)
    const [spikedMaterials, setSpikedMaterials] = useState<materialType[]>([])
    const [flooredMaterials, setFlooredMaterials] = useState<materialType[]>([])
    const [stockMismatch, setStockMismatch] = useState<materialType[]>([])
    useEffect(() => {
        const fetchStoresData = async() => {
            const token = await getToken()
            const result = await api.get("/store", {headers: {Authorization: `Bearer ${token}`}})
            setStores(result.data)
            setSelectedStore(result.data[0])
        }
        fetchStoresData()
    }, [])
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(storeDropdownRef.current && !storeDropdownRef.current.contains(e.target as Node)){
                setStoreDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
    useEffect(() => {
        const fetchPriceSpikes = async() => {
            if(!selectedStore) return 
            const token = await getToken()
            const result = await api.get(`/flagged/pricespike/${selectedStore.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setSpikedMaterials(result.data)
        }
        fetchPriceSpikes()
        const fetchMarginFloors = async() => {
            if(!selectedStore) return 
            const token = await getToken()
            const result = await api.get(`/flagged/marginloss/${selectedStore.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setFlooredMaterials(result.data)
        }
        fetchMarginFloors()
        const fetchStockMismatch = async() => {
            if(!selectedStore) return 
            const token = await getToken()
            const result = await api.get(`/flagged/stockmismatch/${selectedStore.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setStockMismatch(result.data)
        }
        fetchStockMismatch()
    }, [selectedStore])
    useEffect(() => {
        if(!selectedStore) return 
        const fetchSalesData = async() => {
            const token = getToken()
            const result = await api.get(`/completed/${selectedStore.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setSales(result.data.sales)
        }
        fetchSalesData()
    }, [selectedStore])
    return (
        <motion.div className="relative min-h-screen overflow-hidden bg-[#050907] text-white" initial="hidden" animate="show" variants={pageFade}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-225 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(22,101,52,0.18),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_28%)]" />
                <motion.div
                    className="absolute left-1/2 top-28 h-105 w-190 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
                    animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.04, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <Header />

            <motion.main className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-8 sm:py-10" variants={pageFade}>
                <motion.section className="rounded-[2rem] border border-white/8 bg-white/3 p-5 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.95)] backdrop-blur-md sm:p-7" variants={cardRise}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                <Sparkles className="h-3.5 w-3.5" />
                                Live anomaly review
                            </div>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                Anomaly report
                            </h1>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                                Issues found across your latest invoices and sales, shown in a dark-green review layout for quick scanning.
                            </p>
                        </div>

                        <div ref={storeDropdownRef} className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b120f] px-4 py-3 shadow-lg">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Store</p>
                                <button
                                    type="button"
                                    onClick={() => setStoreDropdownOpen((open) => !open)}
                                    className="mt-1 flex items-center gap-2 text-sm font-medium text-white outline-none"
                                >
                                    {selectedStore?.name ?? "Select store"}
                                    <ChevronDown className={storeDropdownOpen ? "h-4 w-4 text-white/40 rotate-180 transition-transform" : "h-4 w-4 text-white/40 transition-transform"} />
                                </button>

                                <AnimatePresence>
                                {storeDropdownOpen && (
                                    <motion.div
                                        className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0b120f] p-1.5 shadow-xl"
                                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                        transition={{ duration: 0.18, ease: "easeOut" }}
                                    >
                                        {stores.length === 0 && (
                                            <p className="px-3 py-2 text-sm text-white/40">No stores found</p>
                                        )}
                                        {stores.map((store) => (
                                            <button
                                                key={store.id}
                                                type="button"
                                                onClick={() => {setSelectedStore(store); setStoreDropdownOpen(false)}}
                                                className={
                                                    selectedStore?.id === store.id
                                                        ? "w-full rounded-xl bg-emerald-400/10 px-3 py-2 text-left text-sm font-medium text-emerald-300 transition"
                                                        : "w-full rounded-xl px-3 py-2 text-left text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                                                }
                                            >
                                                {store.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <motion.div className="rounded-2xl border border-white/8 bg-[#0c1210] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" variants={cardRise} whileHover={{ y: -4 }}>
                            <p className="text-sm text-white/55">Total flagged</p>
                            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{spikedMaterials.length + flooredMaterials.length + stockMismatch.length}</p>
                            <p className="mt-2 text-xs text-white/38">Across invoices and sales</p>
                        </motion.div>
                        <motion.div className="rounded-2xl border border-white/8 bg-[#0c1210] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" variants={cardRise} whileHover={{ y: -4 }}>
                            <p className="text-sm text-white/55">Overcharge exposure</p>
                            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{spikedMaterials.reduce((sum, material) => sum + (Number(material.unit_price) - Number(material.preset_price)) * material.quantity, 0).toFixed(2)}</p>
                            <p className="mt-2 text-xs text-white/38">Estimated unapproved uplift</p>
                        </motion.div>
                        <motion.div className="rounded-2xl border border-white/8 bg-[#0c1210] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" variants={cardRise} whileHover={{ y: -4 }}>
                            <p className="text-sm text-white/55">Below-cost sales</p>
                            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{flooredMaterials.length}</p>
                            <p className="mt-2 text-xs text-white/38">Items sold under target margin</p>
                        </motion.div>
                    </div>

                    <motion.div className="mt-8" variants={cardRise}>
                        <ChartLineInteractive storeId={selectedStore?.id} />
                    </motion.div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-white/8 bg-black/20 p-1">
                            <motion.button
                                type="button"
                                onClick={() => setActiveTab("all")}
                                className={activeTab === "all" ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#05110b] shadow-sm transition" : "rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"}
                                whileTap={{ scale: 0.97 }}
                            >
                                All
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setActiveTab("price spike")}
                                className={activeTab === "price spike" ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#05110b] shadow-sm transition" : "rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"}
                                whileTap={{ scale: 0.97 }}
                            >
                                Price spike
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setActiveTab("margin loss")}
                                className={activeTab === "margin loss" ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#05110b] shadow-sm transition" : "rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"}
                                whileTap={{ scale: 0.97 }}
                            >
                                Margin loss
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setActiveTab("stock mismatch")}
                                className={activeTab === "stock mismatch" ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#05110b] shadow-sm transition" : "rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"}
                                whileTap={{ scale: 0.97 }}
                            >
                                Stock mismatch
                            </motion.button>
                        </div>

                        <div className="ml-auto flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-4 py-2 text-sm text-white/55">
                            <Filter className="h-4 w-4 text-emerald-300" />
                            Filtered results
                        </div>
                    </div>

                    <div className="mt-8">
                        <section className="space-y-4">
                            <AnimatePresence mode="wait">
                            {activeTab === "all" && (
                                <motion.article
                                    key="tab-all"
                                    className="group rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-[#0d1512]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    <div className="space-y-4">
                                        {spikedMaterials.map((material) => (
                                            <div key={`spike-${material.id}`} className="rounded-[1.25rem] border border-white/8 bg-black/10 p-4">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-emerald-300">
                                                            <ArrowUpRight className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="text-base font-semibold text-white sm:text-lg">
                                                                    Price spike — {material.description}
                                                                </h3>
                                                                <span className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                                                                    price spike
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-sm text-white/55">
                                                                Invoice #{material.file_id} · {material.sku}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="inline-flex w-fit items-center rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-sm font-semibold text-rose-300">
                                                        +{Math.round(((Number(material.unit_price) - Number(material.preset_price)) / Number(material.preset_price)) * 100)}%
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-white/70">
                                                    Usually ${Number(material.preset_price).toFixed(2)} · this invoice ${Number(material.unit_price).toFixed(2)} · {material.quantity} units · ${(Number(material.total_price) - Number(material.preset_price) * Number(material.quantity)).toFixed(2)} above expected
                                                </div>
                                            </div>
                                        ))}

                                        {flooredMaterials.map((material) => {
                                            const sale = sales.find(s => s.sku === material.sku)
                                            if(!sale) return null
                                            const lossPercent = Math.round((1 - Number(sale.sale_price) / Number(material.unit_price)) * 100)
                                            const priceDiff = material.unit_price - sale.sale_price
                                            return(
                                            <div key={`margin-${material.id}`} className="rounded-[1.25rem] border border-white/8 bg-black/10 p-4">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-emerald-300">
                                                            <ArrowDownRight className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="text-base font-semibold text-white sm:text-lg">
                                                                    Margin loss — {material.description}
                                                                </h3>
                                                                <span className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                                                                    margin loss
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-sm text-white/55">
                                                                Invoice #{material.file_id} · {material.sku}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="inline-flex w-fit items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-300">
                                                        -{Number(lossPercent).toFixed(1)}% margin
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-white/70">
                                                    Cost {Number(material.unit_price).toFixed(2)} · Sale {sale.sale_price} · {material.quantity} units · {(Number(material.unit_price) * material.quantity - Number(sale.sale_price * material.quantity)).toFixed(2)} below expected · Price Difference {priceDiff.toFixed(2)}
                                                </div>
                                            </div>
                                            )
                                        })}

                                        {stockMismatch.map((material) => {
                                            return(
                                            <div key={`mismatch-${material.id}`} className="rounded-[1.25rem] border border-white/8 bg-black/10 p-4">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-emerald-300">
                                                            <ShieldAlert className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="text-base font-semibold text-white sm:text-lg">Stock mismatch — {material.sku}</h3>
                                                                <span className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                                                                    stock mismatch
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-sm text-white/55">Sold more than was stocked</p>
                                                        </div>
                                                    </div>

                                                    <div className="inline-flex w-fit items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-300">
                                                        {Math.abs(material.quantity)} units short
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-white/70">
                                                    Current stock {material.quantity} · sold more than was ever received
                                                </div>
                                            </div>
                                            )
                                        })}

                                        {spikedMaterials.length === 0 && flooredMaterials.length === 0 && stockMismatch.length === 0 && (
                                            <p className="text-sm text-white/40">No anomalies flagged for this store.</p>
                                        )}
                                    </div>
                                </motion.article>
                            )}
                            {activeTab === "price spike" && (
                                <motion.article
                                    key="tab-price-spike"
                                    className="group rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-[#0d1512]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    <div className="space-y-4">
                                        {spikedMaterials.map((material, index) => (
                                            <motion.div key={material.id} className="rounded-[1.25rem] border border-white/8 bg-black/10 p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: index * 0.03, ease: "easeOut" }}>
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-emerald-300">
                                                            <ArrowUpRight className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="text-base font-semibold text-white sm:text-lg">
                                                                    Price spike — {material.description}
                                                                </h3>
                                                                <span className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                                                                    price spike
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-sm text-white/55">
                                                                Invoice #{material.file_id} · {material.sku}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="inline-flex w-fit items-center rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-sm font-semibold text-rose-300">
                                                        +{Math.round(((Number(material.unit_price) - Number(material.preset_price)) / Number(material.preset_price)) * 100)}%
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-white/70">
                                                    Usually ${Number(material.preset_price).toFixed(2)} · this invoice ${Number(material.unit_price).toFixed(2)} · {material.quantity} units · ${(Number(material.total_price) - Number(material.preset_price) * Number(material.quantity)).toFixed(2)} above expected
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.article>
                            )}

                            {activeTab === "margin loss" && (
                                <motion.article
                                    key="tab-margin-loss"
                                    className="group rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-[#0d1512]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    <div className="space-y-4">
                                        {flooredMaterials.map((material, index) => {
                                            const sale = sales.find(s => s.sku === material.sku)
                                            if(!sale) return null
                                            const lossPercent = Math.round((1 - Number(sale.sale_price) / Number(material.unit_price)) * 100)
                                            const priceDiff = material.unit_price - sale.sale_price
                                            return(
                                            <motion.div key={material.id} className="rounded-[1.25rem] border border-white/8 bg-black/10 p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: index * 0.03, ease: "easeOut" }}>
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-emerald-300">
                                                            <ArrowDownRight className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="text-base font-semibold text-white sm:text-lg">
                                                                    Margin loss — {material.description}
                                                                </h3>
                                                                <span className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                                                                    margin loss
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-sm text-white/55">
                                                                Invoice #{material.file_id} · {material.sku}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="inline-flex w-fit items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-300">
                                                        -{Number(lossPercent).toFixed(1)}% margin
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-white/70">
                                                    Cost {Number(material.unit_price).toFixed(2)} · Sale {sale.sale_price} · {material.quantity} units · {(Number(material.unit_price) * material.quantity - Number(sale.sale_price * material.quantity)).toFixed(2)} below expected · Price Difference {priceDiff.toFixed(2)}
                                                </div>
                                            </motion.div>
                                            )
                                        })}
                                    </div>
                                </motion.article>
                            )}

                            {activeTab === "stock mismatch" && (
                                <motion.article
                                    key="tab-stock-mismatch"
                                    className="group rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-[#0d1512]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    <div className="space-y-4">
                                        {stockMismatch.map((material, index) => {
                                            return(
                                            <motion.div key={material.id} className="rounded-[1.25rem] border border-white/8 bg-black/10 p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: index * 0.03, ease: "easeOut" }}>
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-emerald-300">
                                                            <ShieldAlert className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="text-base font-semibold text-white sm:text-lg">Stock mismatch — {material.sku}</h3>
                                                                <span className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                                                                    stock mismatch
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-sm text-white/55">Sold more than was stocked</p>
                                                        </div>
                                                    </div>

                                                    <div className="inline-flex w-fit items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-300">
                                                        {Math.abs(material.quantity)} units short
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-white/70">
                                                    Current stock {material.quantity} · sold more than was ever received
                                                </div>
                                            </motion.div>
                                            )
                                        })}
                                    </div>
                                </motion.article>
                            )}
                            </AnimatePresence>

                        </section>
                    </div>
                </motion.section>
            </motion.main>
        </motion.div>
    );
}