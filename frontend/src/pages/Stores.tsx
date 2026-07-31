import { useEffect, useState } from "react";
import { Header } from "../assets/Header";
import { useAuth } from "@clerk/react";
import axios from "axios";
import { FileText, Trash2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";

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

export function Stores(){
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
        file_id: number
        sale_date: string
        sku: string
        quantity: number
        sale_price: number
        total: number
    }
    const {getToken} = useAuth()
    const [stores, setStores] = useState<storeType[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const filteredStores = stores.filter((store) => store.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const [materials, setMaterials] = useState<materialType[]>([])
    const [files, setFiles] = useState<fileType[]>([])
    const [selectedFile, setSelectedFile] = useState<fileType | undefined>(undefined)
    const [selectedStore, setSelectedStore] = useState<storeType | undefined>(undefined)
    const [deletedMaterial, setDeletedMaterial] = useState(false)
    const [deletedFile, setDeletedFile] = useState(false)
    const [sales, setSales] = useState<salesType[]>([])
    const [salesFiles, setSalesFiles] = useState<fileType[]>([])
    const [fileTab, setFileTab] = useState<"material" | "sales">("material")
    const filteredMaterials = (fileTab === "material" && selectedFile) ? materials.filter((m) => m.file_id === selectedFile.id) : null
    const filteredSales = (fileTab === "sales" && selectedFile) ? sales.filter((s) => s.file_id === selectedFile.id) : null
    useEffect(() => {
        const fetchStoresData = async() => {
            const token = await getToken()
            const result = await axios.get("http://localhost:5000/store", {headers: {Authorization: `Bearer ${token}`}})
            setStores(result.data)
        }
        fetchStoresData()
    }, [])
    useEffect(() => {
        if(!selectedStore) return 
        const fetchMaterialData = async() => {
            const token = await getToken()
            const result = await axios.get(`http://localhost:5000/completed/${selectedStore.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setMaterials(result.data.materials)
            setFiles(result.data.materialFiles)
            setSalesFiles(result.data.saleFiles)
            setSales(result.data.sales)
        }
        fetchMaterialData()
    }, [selectedStore])
    useEffect(() => {
        if(!selectedStore) return 
        const fetchMaterialData = async() => {
            const token = await getToken()
            const result = await axios.get(`http://localhost:5000/completed/${selectedStore.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setMaterials(result.data.materials)
            setFiles(result.data.files)
            setSales(result.data.sales)
        }
        if(deletedMaterial){
            fetchMaterialData()
            setTimeout(() => {
                setDeletedMaterial(false)
            }, 1000);
        }
        if(deletedFile){
            fetchMaterialData()
            setTimeout(() => {
                setDeletedFile(false)
            }, 1000);
        }
    }, [deletedMaterial, deletedFile])
    return(
        <motion.div className="relative min-h-screen overflow-hidden bg-[#060a09] text-white" initial="hidden" animate="show" variants={pageFade}>
            <Header/>
            <motion.main className="relative z-10 mx-auto max-w-6xl px-8 py-10" variants={pageFade}>
                <motion.h1 className="text-xl font-semibold" variants={cardRise}>Your Stores</motion.h1>

                <motion.input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Stores"
                    className="mt-4 w-full max-w-xs rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    variants={cardRise}
                />

                <div className="mt-4 flex flex-wrap gap-2">
                    {filteredStores.map((store, index) => (
                        <motion.div
                            key={store.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.03, ease: "easeOut" }}
                            className={
                                selectedStore?.id === store.id
                                    ? "cursor-pointer rounded-lg border border-emerald-400/50 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300 transition"
                                    : "cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-emerald-400/30 hover:text-white"
                            }
                            onClick={() => setSelectedStore(store)}
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            {store.name}
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
                    <motion.div className="flex min-w-0 flex-col gap-6" variants={pageFade}>
                        <div>
                            <motion.h2 className="mb-2 text-sm font-semibold text-white/90" variants={cardRise}>Materials Table</motion.h2>
                            <motion.div className="overflow-hidden rounded-xl border border-white/10" variants={cardRise} whileHover={{ y: -2 }}>
                                <div className="max-h-96 overflow-y-auto overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="sticky top-0 z-10">
                                            <tr className="bg-emerald-950 text-white/70">
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Date</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">SKU</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Item Description</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Quantity</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Unit Price</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Preset Price</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Total</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Profit Margin</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(filteredMaterials ?? materials).map((material, index) => (<motion.tr key={material.id} className="border-t border-white/5" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.02, ease: "easeOut" }}>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{new Date(material.purchased_at).toLocaleString()}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.sku}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.description}r</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.quantity}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.unit_price}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.preset_price}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.total_price}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{Number(material.profit_margin).toFixed(2)}%</td>
                                                <td className="whitespace-nowrap px-4 py-2">
                                                    <button onClick={() => deleteMaterial(material.id, selectedStore!.id)} className="text-white/40 hover:text-orange-400 hover:cursor-pointer">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </td>
                                            </motion.tr>))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </div>

                        <div>
                            <motion.h2 className="mb-2 text-sm font-semibold text-white/90" variants={cardRise}>Sales Table</motion.h2>
                            <motion.div className="overflow-hidden rounded-xl border border-white/10" variants={cardRise} whileHover={{ y: -2 }}>
                                <div className="max-h-96 overflow-y-auto overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="sticky top-0 z-10">
                                            <tr className="bg-emerald-950 text-white/70">
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Date</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">SKU</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Quantity</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Price</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(filteredSales ?? sales).length > 0 ? (filteredSales ?? sales).map((sale, index) => (<motion.tr key={sale.id} className="border-t border-white/5" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.02, ease: "easeOut" }}>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{new Date(sale.sale_date).toLocaleDateString()}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{sale.sku}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">{sale.quantity}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">${Number(sale.sale_price).toFixed(2)}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-white/70">${Number(sale.total).toFixed(2)}</td>
                                            </motion.tr>)) : <tr><td colSpan={5} className="px-4 py-6 text-center text-white/40">No sales yet</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div className="min-w-0 rounded-xl border border-white/10 bg-white/3 p-4" variants={cardRise} whileHover={{ y: -3 }}>
                        <p className="truncate text-sm font-semibold text-white/90">Selected File: {selectedFile?.filename}</p>

                        <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 p-1">
                            <motion.button
                                type="button"
                                onClick={() => setFileTab("material")}
                                className={fileTab === "material" ? "flex-1 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-[#05110b] transition" : "flex-1 rounded-md px-3 py-1.5 text-xs font-medium text-white/60 transition hover:text-white"}
                                whileTap={{ scale: 0.98 }}
                            >
                                Material
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setFileTab("sales")}
                                className={fileTab === "sales" ? "flex-1 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-[#05110b] transition" : "flex-1 rounded-md px-3 py-1.5 text-xs font-medium text-white/60 transition hover:text-white"}
                                whileTap={{ scale: 0.98 }}
                            >
                                Sales
                            </motion.button>
                        </div>

                        <div className="mt-3 space-y-2">
                            {(fileTab === "material" ? files : salesFiles)?.map((file, index) => (
                                <motion.div
                                    key={file.id}
                                    onClick={() => setSelectedFile(selectedFile?.id === file.id ? undefined : file)}
                                    className={
                                        selectedFile?.id === file.id
                                            ? "flex w-full cursor-pointer items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300 transition"
                                            : "flex w-full cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-emerald-400/30 hover:text-white"
                                    }
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.22, delay: index * 0.03, ease: "easeOut" }}
                                    whileHover={{ y: -2, scale: 1.01 }}
                                >
                                    <FileText className="h-4 w-4 shrink-0" />
                                    <span className="min-w-0 flex-1 truncate">{file.filename}</span>
                                    <button
                                        onClick={() => deleteFile(file.id, selectedStore!.id)}
                                        className="shrink-0 text-white/40 hover:text-orange-400 hover:cursor-pointer"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.main>

            {deletedMaterial && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-red-950 shadow-xl">
                    <Trash2 className="h-4 w-4" />
                    Material deleted
                </div>
            )}

            {deletedFile && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-red-950 shadow-xl">
                    <Trash2 className="h-4 w-4" />
                    File successfully deleted
                </div>
            )}
        </motion.div>
    )


    async function deleteMaterial(materialId: number, storeId: string){
        const token = getToken()
        const result = await axios.delete(`http://localhost:5000/delete/materials/${materialId}/${storeId}`, {headers: {Authorization: `Bearer ${token}`}})
        setDeletedMaterial(result.data)
    }

    async function deleteFile(fileId: number, storeId: string){
        const token = getToken()
        const result = await axios.delete(`http://localhost:5000/delete/file/${fileId}/${storeId}`, {headers: {Authorization: `Bearer ${token}`}})
        setDeletedFile(result.data)
    }
}