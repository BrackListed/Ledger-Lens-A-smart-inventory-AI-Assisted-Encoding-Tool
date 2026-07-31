import {
    AlertTriangle,
    CheckCircle2,
    CloudUpload,
    Database,
    Layers3,
    Loader2,
    PencilLine,
    Settings2,
    Store,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "../assets/Header";
import { useAuth } from "@clerk/react";
import axios from "axios";
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

type SettingsTab = "set prices" | "thresholds" | "store management" | "cost sheet";

export function Settings() {
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

    interface fileType{
        id: number
        filename: string
        status: string
        store_id: string
        upload_date: string
        user_id: string
    }

    const {getToken} = useAuth()
    const [activeTab, setActiveTab] = useState<SettingsTab>("set prices");
    const [itemSku, setItemSku] = useState("")
    const [itemDescription, setItemDescription] = useState("")
    const [presetPrice, setPresetPrice] = useState(0)
    const [stores, setStores] = useState<storeType[]>([])
    const [materials, setMaterials] = useState<materialType[]>([])
    const [selectedStore, setSelectedStore] = useState<storeType | undefined>(undefined)
    const [materialFiles, setMaterialFiles] = useState<fileType[]>([])
    const [selectedFile, setSelectedFile] = useState<fileType | undefined>(undefined)
    const filteredMaterials: materialType[] = selectedFile ? materials.filter((m) => m.file_id === selectedFile.id) : materials
    const [success, setSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [costSheetFileName, setCostSheetFileName] = useState("")
    const [renameValues, setRenameValues] = useState<Record<string, string>>({})
    const [isEncodingPresetCost, setIsEncodingPresetCost] = useState(false)
    useEffect(() => {
        const fetchStoresData = async() => {
            const token = await getToken()
            const result = await axios.get("http://localhost:5000/store", {headers: {Authorization: `Bearer ${token}`}})
            setStores(result.data)
            setSelectedStore(result.data[0])
        }
        fetchStoresData()
    }, [])

    useEffect(() => {
        if(!selectedStore) return
        fetchMaterialData(selectedStore.id).then(() => setSelectedFile(undefined))
    }, [selectedStore?.id])

    useEffect(() => {
        if(!selectedStore) return 
        const fetchStoresData = async() => {
            const token = await getToken()
            const result = await axios.get("http://localhost:5000/store", {headers: {Authorization: `Bearer ${token}`}})
            setStores(result.data)
            setSelectedStore(result.data.find((s: storeType) => s.id === selectedStore?.id) ?? result.data[0])
        }
        if(success){
            fetchStoresData()
            setTimeout(() => {
                setSuccess(false)
            }, 1000);
        }
    }, [success])
    return (
        <motion.div className="relative min-h-screen overflow-hidden bg-[#050907] text-white" initial="hidden" animate="show" variants={pageFade}>
            <AnimatePresence>
                {isEncodingPresetCost && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#0b120f] px-8 py-10 text-center shadow-2xl"
                            initial={{ opacity: 0, scale: 0.92, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 12 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                            <p className="text-sm font-medium text-white/90">
                                Awaiting AI response.. This may take a bit depending on size
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(22,101,52,0.18),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_28%)]" />
            <div className="pointer-events-none absolute left-1/2 top-28 h-105 w-190 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

            <Header />

            <motion.main className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-8 sm:py-10" variants={pageFade}>
                <motion.section className="rounded-[2rem] border border-white/8 bg-white/3 p-5 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.95)] backdrop-blur-md sm:p-7" variants={cardRise}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                <Settings2 className="h-3.5 w-3.5" />
                                Settings hub
                            </div>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                {activeTab === "set prices"
                                    ? "Preset pricing"
                                    : activeTab === "thresholds"
                                        ? "Anomaly thresholds"
                                        : activeTab === "store management"
                                            ? "Store management"
                                            : "Preset cost sheet"}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b120f] px-4 py-3 shadow-lg">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                <Layers3 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Current store</p>
                                <select
                                    value={selectedStore?.id ?? ""}
                                    onChange={(e) => setSelectedStore(stores.find((store) => store.id === e.target.value))}
                                    className="mt-1 w-48 rounded-xl border border-white/10 bg-[#0b120f] px-3 py-2 text-sm font-medium text-white outline-none"
                                >
                                    <option value="" disabled>Select a store</option>
                                    {stores.map((store) => (<option key={store.id} value={store.id}>{store.name}</option>))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-[#0b110f] p-2">
                        <motion.button
                            type="button"
                            onClick={() => setActiveTab("set prices")}
                            className={activeTab === "set prices" ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#05110b] shadow-sm transition" : "rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"}
                            whileTap={{ scale: 0.97 }}
                        >
                            Set prices
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setActiveTab("thresholds")}
                            className={activeTab === "thresholds" ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#05110b] shadow-sm transition" : "rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"}
                            whileTap={{ scale: 0.97 }}
                        >
                            Anomaly thresholds
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setActiveTab("store management")}
                            className={activeTab === "store management" ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#05110b] shadow-sm transition" : "rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"}
                            whileTap={{ scale: 0.97 }}
                        >
                            Store management
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setActiveTab("cost sheet")}
                            className={activeTab === "cost sheet" ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#05110b] shadow-sm transition" : "rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"}
                            whileTap={{ scale: 0.97 }}
                        >
                            Preset cost sheet
                        </motion.button>
                    </div>

                    <AnimatePresence mode="wait">
                    {activeTab === "set prices" && (
                        <motion.section
                            key="set-prices"
                            className="mt-8 rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/35">Preset pricing</p>
                                    <h2 className="mt-2 text-lg font-semibold text-white">Markup rules per store</h2>
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                    <Store className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <label className="text-xs uppercase tracking-[0.24em] text-white/35">Filter by file</label>
                                <select
                                    value={selectedFile?.id ?? ""}
                                    className="w-64 rounded-xl border border-white/10 bg-[#0b120f] px-3 py-2 text-sm font-medium text-white outline-none"
                                    onChange={(e) => {setSelectedFile(materialFiles.find((file) => file.id === Number(e.target.value)))}}
                                >
                                    <option value="">All files</option>
                                    {materialFiles.map((file) => (<option key={file.id} value={file.id}>{file.filename}</option>))}
                                </select>
                            </div>

                            <table className="mt-5 w-full overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#0c1210]">
                                <thead>
                                    <tr className="border-b border-white/8 text-left text-xs uppercase tracking-[0.18em] text-white/45">
                                        <th className="px-4 py-3">SKU</th>
                                        <th className="px-4 py-3">Description</th>
                                        <th className="px-4 py-3">Unit Cost (Preset)</th>
                                        <th className="px-4 py-3">Sell Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMaterials.map((material, index) => (<motion.tr key={material.id} className="border-b border-white/8" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.02, ease: "easeOut" }}>
                                        <td className="px-4 py-4 align-top">
                                            <input onChange={(e) => {setItemSku(e.target.value) ;updateMaterial(material.id, presetPrice, e.target.value, itemDescription)}} readOnly={true} defaultValue={material.sku}className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <input onChange={(e) => {setItemDescription(e.target.value); updateMaterial(material.id, presetPrice, itemSku, e.target.value)}} readOnly={true} defaultValue={material.description} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <input onChange={(e) => {setPresetPrice(Number(e.target.value)); updateMaterial(material.id, Number(e.target.value), itemSku, itemDescription)}} defaultValue={Number(material.preset_price).toFixed(2) ?? "No preset price"} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <input value={(material.preset_price * 1.30).toFixed(2)} readOnly className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                                        </td>
                                    </motion.tr>))}
                                </tbody>
                            </table>

                            <div className="mt-4 flex justify-end">
                                <motion.button type="button" className="rounded-2xl border border-emerald-400/20 bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300" whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                    Save pricing rules
                                </motion.button>
                            </div>
                        </motion.section>
                    )}

                    {activeTab === "thresholds" && (
                        <motion.section
                            key="thresholds"
                            className="mt-8 rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/35">Alert rules</p>
                                    <h2 className="mt-2 text-lg font-semibold text-white">Anomaly thresholds</h2>
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                            </div>

                            <table className="mt-5 w-full overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#0c1210]">
                                <thead>
                                    <tr className="border-b border-white/8 text-left text-xs uppercase tracking-[0.18em] text-white/45">
                                        <th className="px-4 py-3">Rule</th>
                                        <th className="px-4 py-3">Threshold</th>
                                        <th className="px-4 py-3">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-white/8">
                                        <td className="px-4 py-4 text-sm font-medium text-white">Price jump spike</td>
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                <input
                                                    key={`spike-${selectedStore?.id}`}
                                                    onBlur={(e) => {if(!selectedStore){return }updateAnomalyThresholds(selectedStore.id, {spike: Number(e.target.value)})}}
                                                    onKeyDown={(e) => {if(e.key === "Enter"){e.currentTarget.blur()}}}
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    defaultValue={selectedStore?.price_spike}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 pr-9 text-sm text-white outline-none"
                                                />
                                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-white/35">%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <input readOnly defaultValue="Flag when invoice price rises above the threshold" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                                        </td>
                                    </tr>
                                    <tr className="border-b border-white/8">
                                        <td className="px-4 py-4 text-sm font-medium text-white">Margin loss floor</td>
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                <input
                                                    key={`floor-${selectedStore?.id}`}
                                                    onBlur={(e) => {if(!selectedStore){return }updateAnomalyThresholds(selectedStore.id, {floor: Number(e.target.value)})}}
                                                    onKeyDown={(e) => {if(e.key === "Enter"){e.currentTarget.blur()}}}
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    defaultValue={selectedStore?.margin_floor}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 pr-9 text-sm text-white outline-none"
                                                />
                                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-white/35">%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <input readOnly defaultValue="Review sales below target margin" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                                        </td>
                                    </tr>
                                    <tr className="border-b border-white/8">
                                        <td className="px-4 py-4 text-sm font-medium text-white">Stock mismatch variance</td>
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                <input
                                                    key={`mismatch-${selectedStore?.id}`}
                                                    onBlur={(e) => {if(!selectedStore){return }updateAnomalyThresholds(selectedStore.id, {mismatch: Number(e.target.value)})}}
                                                    onKeyDown={(e) => {if(e.key === "Enter"){e.currentTarget.blur()}}}
                                                    type="number"
                                                    defaultValue={selectedStore?.mismatch}
                                                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 pr-9 text-sm text-white outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                />
                                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-white/35">units</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <input readOnly defaultValue="Flag when sold quantity exceeds stock" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </motion.section>
                    )}

                    {activeTab === "store management" && (
                        <motion.section
                            key="store-management"
                            className="mt-8 rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/35">Stores</p>
                                    <h2 className="mt-2 text-lg font-semibold text-white">Rename or delete stores</h2>
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                    <Database className="h-5 w-5" />
                                </div>
                            </div>

                            <table className="mt-5 w-full overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#0c1210]">
                                <thead>
                                    <tr className="border-b border-white/8 text-left text-xs uppercase tracking-[0.18em] text-white/45">
                                        <th className="px-4 py-3">Select</th>
                                        <th className="px-4 py-3">Store name</th>
                                        <th className="px-4 py-3">Store input</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stores.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-4 text-sm text-white/40">
                                                No stores found
                                            </td>
                                        </tr>
                                    )}
                                    {stores.map((store, index) => (
                                        <motion.tr key={store.id} className={index === stores.length - 1 ? "" : "border-b border-white/8"} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.03, ease: "easeOut" }}>
                                            <td className="px-4 py-4 align-top">
                                                <input
                                                    type="radio"
                                                    name="store"
                                                    checked={selectedStore?.id === store.id}
                                                    onChange={() => setSelectedStore(store)}
                                                />
                                            </td>
                                            <td className="px-4 py-4 align-top text-sm font-medium text-white">{store.name}</td>
                                            <td className="px-4 py-4 align-top">
                                                <input
                                                    value={renameValues[store.id] ?? store.name}
                                                    onChange={(e) => setRenameValues(prev => ({...prev, [store.id]: e.target.value}))}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-4 align-top">
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => renameStore(store.id, renameValues[store.id] ?? store.name)}
                                                        className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#0c1210] px-3 py-2 text-sm text-white/75 transition hover:cursor-pointer hover:text-white"
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        <PencilLine className="h-4 w-4 text-emerald-300" />
                                                        Rename
                                                    </motion.button>
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => {
                                                            if(window.confirm(`Delete "${store.name}"? This removes all of its materials, sales, and files.`)){
                                                                deleteStore(store.id)
                                                            }
                                                        }}
                                                        className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 transition hover:cursor-pointer hover:bg-rose-500/15"
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.section>
                    )}

                    {activeTab === "cost sheet" && (
                        <motion.section
                            key="cost-sheet"
                            className="mt-8 rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/35">Cost sheet</p>
                                    <h2 className="mt-2 text-lg font-semibold text-white">Preset cost sheet upload</h2>
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                    <CloudUpload className="h-5 w-5" />
                                </div>
                            </div>

                            <table className="mt-5 w-full overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#0c1210]">
                                <thead>
                                    <tr className="border-b border-white/8 text-left text-xs uppercase tracking-[0.18em] text-white/45">
                                        <th className="px-4 py-3">File</th>
                                        <th className="px-4 py-3">Accepted types</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-4 align-top">
                                            <input
                                                type="file"
                                                accept=".csv,.xls,.xlsx"
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-400 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-950"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    setCostSheetFileName(file?.name ?? "")
                                                    if (file && selectedStore?.id) {
                                                        encodePresetCost(file, selectedStore.id)
                                                    }
                                                }}
                                            />
                                            {costSheetFileName && (
                                                <p className="mt-2 text-xs text-white/50">{costSheetFileName}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 align-top text-sm text-white/70">CSV, XLS, XLSX</td>
                                    </tr>
                                </tbody>
                            </table>
                        </motion.section>
                    )}
                    </AnimatePresence>
                </motion.section>
            </motion.main>
            <AnimatePresence>
                {success && (
                    <motion.div
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-3 text-sm font-medium text-emerald-950 shadow-xl"
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        {successMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
    async function fetchMaterialData(storeId: string){
        const token = await getToken()
        const result = await axios.get(`http://localhost:5000/completed/${storeId}`, {headers: {Authorization: `Bearer ${token}`}})
        setMaterials(result.data.materials)
        setMaterialFiles(result.data.materialFiles)
    }

    async function updateMaterial(materialId: number, price: number, sku: string, description: string){
        const token = getToken()
        if(price){
            const result = await axios.patch(`http://localhost:5000/update/material/${materialId}`, {price: price}, {headers: {Authorization: `Bearer ${token}`}})
            setMaterials((currentMaterials) => currentMaterials.map((material) => material.id === materialId ? {...material, preset_price: price} : material))
            setSuccess(result.data.status)
            setSuccessMessage(result.data.message)
        } else if(sku){
            const result = await axios.patch(`http://localhost:5000/update/material/${materialId}`, {sku: sku}, {headers: {Authorization: `Bearer ${token}`}})
            setSuccess(result.data.status)
            setSuccessMessage(result.data.message)
        } else if(description){
            const result = await axios.patch(`http://localhost:5000/update/material/${materialId}`, {description: description}, {headers: {Authorization: `Bearer ${token}`}})
            setSuccess(result.data.status)
            setSuccessMessage(result.data.message)
        }
    }
    
    async function updateAnomalyThresholds(storeId: string, thresholds: {spike?: number, floor?: number, mismatch?: number}){
        const token = await getToken()
        const result = await axios.patch(`http://localhost:5000/set/thresholds/${storeId}`, thresholds, {headers: {Authorization: `Bearer ${token}`}})
        setSuccess(result.data.status)
        setSuccessMessage(result.data.message)
    }

    async function encodePresetCost(preset: File, storeId: string){
        setIsEncodingPresetCost(true)
        const token = await getToken()
        const formData = new FormData()
        formData.append("preset", preset)
        const result = await axios.patch(`http://localhost:5000/encode/preset/${storeId}`, formData, {headers: {Authorization: `Bearer ${token}`}})
        setSuccess(result.data.status)
        setSuccessMessage(result.data.message)
        if(result.data.status){
            fetchMaterialData(storeId)
        }
        setIsEncodingPresetCost(false)
    }

    async function renameStore(storeId: string, name: string){
        const token = await getToken()
        const result = await axios.patch(`http://localhost:5000/store/${storeId}`, {name: name}, {headers: {Authorization: `Bearer ${token}`}})
        setSuccess(result.data.status)
        setSuccessMessage(result.data.message)
    }

    async function deleteStore(storeId: string){
        const token = await getToken()
        const result = await axios.delete(`http://localhost:5000/store/${storeId}`, {headers: {Authorization: `Bearer ${token}`}})
        setSuccess(result.data.status)
        setSuccessMessage(result.data.message)
    }
}