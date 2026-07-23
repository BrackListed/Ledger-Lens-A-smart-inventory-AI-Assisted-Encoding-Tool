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
    const {getToken} = useAuth()
    const [stores, setStores] = useState<storeType[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const filteredStores = stores.filter((store) => store.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
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
                                <tr className="border-t border-white/5">
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">07/01/2026</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-100</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">Cupcake Flour 25kg</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">50</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$30.00</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$22.00</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$1,500.00</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">26.6%</td>
                                </tr>
                                <tr className="border-t border-white/5">
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">07/03/2026</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-101</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">Vanilla Extract 1L</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">12</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$18.00</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$14.50</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$216.00</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">19.4%</td>
                                </tr>
                                <tr className="border-t border-white/5">
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">07/08/2026</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-102</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">Sprinkles Mix 5kg</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">20</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$9.50</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$7.00</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$190.00</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">26.3%</td>
                                </tr>
                                <tr className="border-t border-white/5">
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">07/12/2026</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-103</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">Cupcake Liners 500ct</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">30</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$6.20</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$4.80</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">$186.00</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-white/70">22.6%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-sm font-semibold text-white/90">Files</p>
                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                                <FileText className="h-4 w-4 shrink-0 text-white/40" />
                                invoice_9931.pdf
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                                <FileText className="h-4 w-4 shrink-0 text-white/40" />
                                invoice_8820.pdf
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                                <FileText className="h-4 w-4 shrink-0 text-white/40" />
                                sales_sheet_june.xlsx
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                                <FileText className="h-4 w-4 shrink-0 text-white/40" />
                                receipt_scan_0042.pdf
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}