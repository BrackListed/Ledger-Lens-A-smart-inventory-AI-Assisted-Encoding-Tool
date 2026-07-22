import { Loader2, CheckCircle2, AlertTriangle, FileText, Sparkles } from "lucide-react";
import { Header } from "../assets/Header";

export function Encoder(){
    return(
        <div className="relative min-h-screen overflow-hidden bg-[#060a09] text-white">
            <Header/>

            <main className="relative z-10 mx-auto max-w-6xl px-8 py-10">
                <h1 className="text-xl font-semibold">Automated Encoder &amp; Confirmation</h1>

                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-5 py-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-white/60">Processing:</span>
                            <span className="font-medium text-emerald-400">invoice_9931.pdf</span>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-white/40" />
                        </div>
                        <p className="mt-1 text-xs text-white/40">
                            AI Extraction Complete. Please review and confirm line items.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="rounded-md border border-white/15 px-4 py-2 text-sm text-white/80">
                            Discard File
                        </button>
                        <button className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-emerald-950">
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
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Profit Margin (%)</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-white/5">
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-100</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">Cupcake Flour 25kg</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">50</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$30.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$22.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">26.6%</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <span className="inline-flex items-center gap-1 text-emerald-400">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Verified
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-t border-white/5">
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-100</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">Cupcake Flour 25kg</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">50</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$30.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$22.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">26.6%</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <span className="inline-flex items-center gap-1 text-emerald-400">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Verified
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-t border-white/5">
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-100</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">Cupcake Flour 25kg</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">50</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$30.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$22.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">26.6%</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <span className="inline-flex items-center gap-1 text-emerald-400">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Verified
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-t border-white/5">
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-100</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">Cupcake Flour 25kg</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">50</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$30.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$22.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">26.6%</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <span className="inline-flex items-center gap-1 text-orange-400">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        Flagged: Price Spike
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-t border-white/5">
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-100</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">Cupcake Flour 25kg</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">40</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$30.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$22.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">26.6%</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <span className="inline-flex items-center gap-1 text-orange-400">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        Flagged: Price Spike
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-t border-white/5">
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">CM-100</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">Cupcake Flour 25kg</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">50</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$30.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">$22.00</td>
                                <td className="whitespace-nowrap px-4 py-2 text-white/70">26.6%</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <span className="inline-flex items-center gap-1 text-orange-400">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        Flagged: Price Spike
                                    </span>
                                </td>
                            </tr>
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
                            <input
                                placeholder="Date"
                                className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30"
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
            </main>

            <Sparkles className="pointer-events-none absolute bottom-6 right-6 h-6 w-6 text-white/20" />
        </div>
    )
}
