import { useEffect, useState } from "react";
import { Header } from "../assets/Header";
import { useAuth } from "@clerk/react";
import axios from "axios";
import { FileText } from "lucide-react";

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
    const {getToken} = useAuth()
    const [stores, setStores] = useState<storeType[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const filteredStores = stores.filter((store) => store.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const [materials, setMaterials] = useState<materialType[]>([])
    const [files, setFiles] = useState<fileType[]>([])
    const [selectedFile, setSelectedFile] = useState<fileType | undefined>(undefined)
    const [selectedStore, setSelectedStore] = useState<storeType | undefined>(undefined)
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
            setFiles(result.data.files)
            console.log(result.data.files)
        }
        fetchMaterialData()
    }, [selectedStore])
    return(
        <div className="relative min-h-screen overflow-hidden bg-[#060a09] text-white">
            <Header/>
            <main className="relative z-10 mx-auto max-w-6xl px-8 py-10">
                <h1 className="text-xl font-semibold">Your Stores</h1>

                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Stores"
                    className="mt-4 w-full max-w-xs rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                    {filteredStores.map((store) => (
                        <div
                            key={store.id}
                            className={
                                selectedStore?.id === store.id
                                    ? "cursor-pointer rounded-lg border border-emerald-400/50 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300 transition"
                                    : "cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-emerald-400/30 hover:text-white"
                            }
                            onClick={() => setSelectedStore(store)}
                        >
                            {store.name}
                        </div>
                    ))}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-emerald-900/40 text-white/70">
                                    <th className="whitespace-nowrap px-4 py-2 font-medium">Date</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium">SKU</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium">Item Description</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium">Quantity</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium">Unit Price</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium">Preset Price</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium">Total</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium">Profit Margin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((material) => (<tr className="border-t border-white/5">
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">{new Date(material.purchased_at).toLocaleString()}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.sku}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.description}r</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.quantity}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.unit_price}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.preset_price}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.total_price}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">{material.profit_margin}%</td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-sm font-semibold text-white/90">Files</p>
                        <div className="mt-3 space-y-2">
                            {files?.map((file) => (<div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                                <FileText className="h-4 w-4 shrink-0 text-white/40" />
                                {file.filename}
                            </div>))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}