import { CheckCircle2, AlertTriangle, FileText, Trash2, XIcon, Loader2 } from "lucide-react";
import { Header } from "../assets/Header";
import { useEffect, useState } from "react";
import { api } from "#lib/api";
import { useAuth } from "@clerk/react";
import { useLocation } from "react-router-dom"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';
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

export function Encoder(){
    interface storeType{
        created_at: string
        id: string
        name: string
        user_id: string
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

    interface salesType{
        id: string
        date: string
        sku: string
        quantity: number
        sale_price: number
        total: number
    }
    const {getToken} = useAuth()
    const { state } = useLocation()
    const [storeQuery, setStoreQuery] = useState("")
    const [selectedStore, setSelectedStore] = useState<storeType | undefined>(state?.store ?? undefined)
    const [isStoreFocused, setIsStoreFocused] = useState(false)
    const [stores, setStores] = useState<storeType[]>([])
    const filteredStores = stores.filter((store) => store.name.toLowerCase().includes(storeQuery.toLowerCase()))
    const [fileName, setFileName] = useState("")
    const [materials, setMaterials] = useState<materialType[]>([])
    const [file, setFile] = useState<fileType | undefined>(undefined)
    const [saved, setSaved] = useState(false)
    const [saleDate, setSaleDate] = useState<Date | null>(null)
    const [singularSale, setSingularSale] = useState<salesType>({ id: "", sku: "", quantity: 0, sale_price: 0, date: "", total: 0 })
    const [sales, setSales] = useState<salesType[]>([])
    const [forwardedToStore, setForwardedToStore] = useState(false)
    const [salesFileId, setSalesFileId] = useState(0)
    const [salesFileName, setSalesFileName] = useState("")
    const [success, setSuccess] = useState<boolean | undefined>(undefined)
    const [successMessage, setSuccessMessage] = useState("")
    const [isEncodingSales, setIsEncodingSales] = useState(false)
    useEffect(() => {
        const fetchStoresData = async() => {
            const token = await getToken()
            const result = await api.get("/store", {headers: {Authorization: `Bearer ${token}`}})
            setStores(result.data)
        }
        fetchStoresData()
    }, [])
    useEffect(() => {
        if(!selectedStore) return
        const fetchMaterialsData = async() => {
            const token = await getToken()
            const result = await api.get(`/materials/${selectedStore?.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setFileName(result.data.file?.[0]?.filename ?? "")
            setFile(result.data.file[0])
            setMaterials(result.data.materials)
        }
        fetchMaterialsData()
        const fetchSalesData = async() => {
            if(!selectedStore) return
            const token = await getToken()
            const result = await api.get(`/sales/${selectedStore.id}`, {headers: {Authorization: `Bearer ${token}`}})
            console.log(result.data.file)
            setSales(result.data.sales)
            setSalesFileName(result.data.file[0].filename)
            setSalesFileId(result.data.file[0].id)
        }
        fetchSalesData()
    }, [selectedStore])

    useEffect(() => {
        if(saved){
            setTimeout(() => {
                setSaved(false)
            }, 1000);
        }
    }, [saved])

    useEffect(() => {
        if(forwardedToStore){
            setTimeout(() => {
                setForwardedToStore(false)
            }, 1000);
        }
    }, [forwardedToStore])

    useEffect(() => {
        if(success){
            setTimeout(() => {
                setSuccess(undefined)
            }, 1000);
        }
    }, [success])
    return(
        <motion.div className="relative min-h-screen overflow-hidden bg-[#060a09] text-white" initial="hidden" animate="show" variants={pageFade}>
            <AnimatePresence>
                {isEncodingSales && (
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

            <Header/>

            <motion.main className="relative z-10 mx-auto max-w-6xl px-8 py-10" variants={pageFade}>
                <motion.h1 className="text-xl font-semibold" variants={cardRise}>Automated Encoder &amp; Confirmation</motion.h1>

                <motion.div className="flex items-start gap-4" variants={cardRise}>
                    <div className="relative mt-4 max-w-xs">
                        <p className="mb-2 text-xs text-white/50">Selected Store</p>
                        <input
                            value={storeQuery}
                            onChange={(e) => setStoreQuery(e.target.value)}
                            onFocus={() => setIsStoreFocused(true)}
                            onBlur={() => setIsStoreFocused(false)}
                            placeholder="Search store..."
                            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        />
                        <AnimatePresence>
                        {storeQuery && isStoreFocused && (
                            <motion.div
                                onMouseDown={(e) => e.preventDefault()}
                                className="absolute z-10 mt-1 w-full rounded-md border border-white/10 bg-[#0d1412] py-1 shadow-xl"
                                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                                {filteredStores.length > 0 ? (
                                    filteredStores.map((store) => (
                                        <div
                                            key={store.id}
                                            onClick={() => {setStoreQuery(store.name); setSelectedStore(store)}}
                                            className="cursor-pointer px-3 py-2 text-sm text-white/80 hover:bg-emerald-400/10 hover:text-emerald-300"
                                        >
                                            {store.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-white/30">No matches</div>
                                )}
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                    {selectedStore && (
                        <motion.div className="mt-4 flex flex-col" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
                            <p className="mb-2 text-xs text-white/50 invisible">Selected</p>
                            <div className="whitespace-nowrap rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
                                Selected Store: {selectedStore.name}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {!selectedStore && (
                    <motion.p className="mt-10 text-center text-lg font-semibold text-orange-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                        Select a store first!
                    </motion.p>
                )}

                {selectedStore && (
                <>
                <motion.div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-5 py-4" variants={cardRise} initial="hidden" animate="show">
                    <div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-white/60">Processing:</span>
                            <span className="font-medium text-emerald-400">{fileName}</span>
                        </div>
                        <p className="mt-1 text-xs text-white/40">
                            AI Extraction Complete. Please review and confirm line items.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            type="button"
                            onClick={() => deleteFile(file?.id, selectedStore.id)}
                            className="inline-flex items-center gap-2 rounded-md border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:cursor-pointer hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-rose-100"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Trash2 className="h-4 w-4" />
                            Discard File
                        </motion.button>
                        <motion.button onClick={() => confirmFile(file?.id)} className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-500 hover:cursor-pointer" whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                            Confirm &amp; Send to Material List
                        </motion.button>
                    </div>
                </motion.div>

                <h2 className="mt-8 text-sm font-semibold text-white/90">
                    Extracted Material Line Items (Draft)
                </h2>

                <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-emerald-900/40 text-white/70">
                                <th className="whitespace-nowrap px-4 py-2 font-medium">SKU</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Item Description</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Quantity</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Unit Price (Extracted)</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Unit Cost (Preset)</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Total</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Profit Margin (%)</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((material, index) => (<motion.tr className="border-t border-white/5" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.02, ease: "easeOut" }}>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.sku}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.description}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.quantity}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.unit_price}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.preset_price ?? "No Preset Price"}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.total_price}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.profit_margin}%</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <span className={`inline-flex items-center gap-1 ${material.status === "Verified" ? "text-emerald-400" : "text-orange-400"}`}>
                                        {material.status === "Verified" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                                        <span>{material.status === "Verified" ? "Verified" : "Flagged"}</span>
                                    </span>
                                </td>
                            </motion.tr>))}
                        </tbody>
                    </table>
                </div>

                <h2 className="mt-10 text-base font-semibold">Sales Ledger Encoding</h2>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <p className="mb-2 text-xs text-white/50">(Manual Form)</p>
                        <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                            <div className="grid grid-cols-3 gap-2">
                                <input
                                    onChange={(e) => setSingularSale(prev => ({...prev, sku: e.target.value}))}
                                    placeholder="Sold Item SKU"
                                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30"
                                />
                                <input
                                    onChange={(e) => setSingularSale(prev => ({...prev, quantity: Number(e.target.value), total: Number(e.target.value) * prev.sale_price}))}
                                    placeholder="Quantity Sold"
                                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30"
                                />
                                <input
                                    onChange={(e) => setSingularSale(prev => ({...prev, sale_price: Number(e.target.value), total: Number(e.target.value) * prev.quantity}))}
                                    placeholder="Sale Price"
                                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30"
                                />
                            </div>
                            <DatePicker
                                selected={saleDate}
                                onChange={(date: Date | null) => {
                                    setSaleDate(date);
                                    setSingularSale(prev => ({
                                        ...prev,
                                        date: date ? new Date(date).toLocaleDateString() : ''
                                    }));
                                }}
                                placeholderText="Date"
                                wrapperClassName="mt-2 w-full block"
                                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30"
                            />
                            <motion.button onClick={async() => setSales(prev => [...prev, {...singularSale, id: uuidv4()}])} className="mt-3 w-full rounded-md bg-white/10 py-2 text-xs font-medium text-white/90" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                Add Single Sale
                            </motion.button>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-xs text-white/50">(Bulk Upload)</p>
                        <motion.label
                            htmlFor="sales-sheet-upload"
                            className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/2 p-4 text-center"
                            whileHover={{ y: -2, borderColor: "rgba(52,211,153,0.4)" }}
                        >
                            <FileText className="h-6 w-6 text-white/40" />
                            <p className="text-xs text-white/50">
                                Drag &amp; Drop Excel Sales Sheet (.csv, .xlsx)
                            </p>
                            <input
                                id="sales-sheet-upload"
                                type="file"
                                accept=".csv,.xls,.xlsx"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        encodeSales(file, selectedStore!.id, file.name);
                                        setSalesFileName(file.name);
                                    }
                                }}
                            />
                        </motion.label>
                    </div>
                </div>

                <h2 className="mt-10 text-sm font-semibold text-white/90">Sales Table: {salesFileName}</h2>

                <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-emerald-950 text-white/70">
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Date</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">SKU</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Quantity</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Price</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Total</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales?.map((sale, index) => (<motion.tr key={sale.id} className="border-t border-white/5" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.02, ease: "easeOut" }}>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{sale.date ?? new Date().toLocaleDateString()}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{sale.sku}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{sale.quantity}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{sale.sale_price}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{Number(sale.total).toFixed(2)}</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <button onClick={() => setSales(prev => prev.filter(s => s.id !== sale.id))} className="text-white/40 hover:text-orange-400 hover:cursor-pointer">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </td>
                            </motion.tr>))}
                        </tbody>
                    </table>
                </div>

                <motion.button onClick={() => sendSales(sales, salesFileId)} className="mt-4 rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-500 hover:cursor-pointer" whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    Forward to Stores
                </motion.button>
                </>
                )}

                <AnimatePresence>
                {forwardedToStore && (
                    <motion.div
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-3 text-sm font-medium text-emerald-950 shadow-xl"
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Sales forwarded to store successfully
                    </motion.div>
                )}
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
                {success === false && (
                    <motion.div
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-red-400 px-4 py-3 text-sm font-medium text-zinc-100 shadow-xl"
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <XIcon className="h-4 w-4" />
                        {successMessage}
                    </motion.div>
                )}
                </AnimatePresence>
            </motion.main>

        </motion.div>
    )
    
    async function confirmFile(id: number | undefined){
        const result = await api.patch(`/confirm/${id}`)
        setSuccess(result.data)
        if(result.data){
            setMaterials([])
            setFileName("")
        }
    }

    async function encodeSales(file: File, storeId: string, name: string){
        setIsEncodingSales(true)
        const token = await getToken()
        const formData = new FormData()
        formData.append("sales", file)
        formData.append("name", name)
        const result = await api.post(`/encode/sales/${storeId}`, formData, {headers: {Authorization: `Bearer ${token}`}})
        setSales(result.data.sales)
        setSalesFileId(result.data.id)
        setSuccess(result.data.status)
        setSuccessMessage(result.data.message)
        setIsEncodingSales(false)
    }

    async function sendSales(sales: salesType[], fileId: number){
        const token = await getToken()
        const result = await api.post(`/confirm/sales/${fileId}`, {sales: sales}, {headers: {Authorization: `Bearer ${token}`}})
        setForwardedToStore(result.data)
        if(result.data){
            setSales([])
            setSalesFileName("")
        }
    }

    async function deleteFile(id: number | undefined, storeId: string){
        const token = await getToken()
        const result = await api.delete(`/delete/file/${id}/${storeId}`, {headers: {Authorization: `Bearer ${token}`}})
        setSuccess(result.data)
        setSuccessMessage("File discarded successfully")
        if(result.data){
            setMaterials([])
            setFileName("")
        }
    }

}
