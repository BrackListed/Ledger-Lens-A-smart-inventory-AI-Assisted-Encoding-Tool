import { CheckCircle2, AlertTriangle, FileText, } from "lucide-react";
import { Header } from "../assets/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import { useLocation } from "react-router-dom"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
        const fetchMaterialsData = async() => {
            const token = await getToken()
            const result = await axios.get(`http://localhost:5000/materials/${selectedStore?.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setFileName(result.data.file[0].filename)
            setFile(result.data.file[0])
            setMaterials(result.data.materials)
        }
        fetchMaterialsData()
    }, [selectedStore])

    useEffect(() => {
        if(saved){
            setTimeout(() => {
                setSaved(false)
            }, 1000);
        }
    }, [saved])
    return(
        <div className="relative min-h-screen overflow-hidden bg-[#060a09] text-white">
            <Header/>

            <main className="relative z-10 mx-auto max-w-6xl px-8 py-10">
                <h1 className="text-xl font-semibold">Automated Encoder &amp; Confirmation</h1>

                <div className="flex items-start gap-4">
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
                        {storeQuery && isStoreFocused && (
                            <div
                                onMouseDown={(e) => e.preventDefault()}
                                className="absolute z-10 mt-1 w-full rounded-md border border-white/10 bg-[#0d1412] py-1 shadow-xl"
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
                            </div>
                        )}
                    </div>

                    {selectedStore && (
                        <div className="mt-4 flex flex-col">
                            <p className="mb-2 text-xs text-white/50 invisible">Selected</p>
                            <div className="whitespace-nowrap rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
                                Selected Store: {selectedStore.name}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-5 py-4">
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
                        <button className="rounded-md border border-white/15 px-4 py-2 text-sm text-white/80">
                            Discard File
                        </button>
                        <button onClick={() => confirmFile(file?.id)} className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-500 hover:cursor-pointer">
                            Confirm &amp; Add to Material List
                        </button>
                    </div>
                </div>

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
                            {materials.map((material) => (<tr className="border-t border-white/5">
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
                            </tr>))}
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
                                    placeholder="Sold Item SKU"
                                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30"
                                />
                                <input
                                    placeholder="Quantity Sold"
                                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30"
                                />
                                <input
                                    placeholder="Sale Price"
                                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30"
                                />
                            </div>
                            <DatePicker
                                selected={saleDate}
                                onChange={(date: Date | null) => setSaleDate(date)}
                                placeholderText="Date"
                                wrapperClassName="mt-2 w-full block"
                                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30"
                            />
                            <button className="mt-3 w-full rounded-md bg-white/10 py-2 text-xs font-medium text-white/90">
                                Add Single Sale
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-xs text-white/50">(Bulk Upload)</p>
                        <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/2 p-4 text-center">
                            <FileText className="h-6 w-6 text-white/40" />
                            <p className="text-xs text-white/50">
                                Drag &amp; Drop Excel Sales Sheet (.csv, .xlsx)
                            </p>
                        </div>
                    </div>
                </div>

                <h2 className="mt-10 text-sm font-semibold text-white/90">Sales History</h2>

                <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-emerald-950 text-white/70">
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Date</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">SKU</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Quantity</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Price</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-white/5">
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">07/01/2026</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-100</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">5</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$30.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$150.00</td>
                            </tr>
                            <tr className="border-t border-white/5">
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">07/03/2026</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-101</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">2</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$18.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$36.00</td>
                            </tr>
                            <tr className="border-t border-white/5">
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">07/08/2026</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-102</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">10</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$9.50</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$95.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>

        </div>
    )
    
    async function confirmFile(id: number | undefined){
        const result = await axios.patch(`http://localhost:5000/confirm/${id}`)
        setSaved(result.data)
    }
    

}
