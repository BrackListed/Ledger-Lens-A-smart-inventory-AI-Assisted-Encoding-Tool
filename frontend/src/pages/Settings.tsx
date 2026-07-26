import {
    AlertTriangle,
    ArrowRight,
    ChevronDown,
    CloudUpload,
    Database,
    Layers3,
    LineChart,
    Package2,
    PencilLine,
    Settings2,
    Store,
    Trash2,
    Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "../assets/Header";

type SettingsTab = "set prices" | "thresholds" | "store management" | "cost sheet";

type PriceRow = {
    sku: string;
    description: string;
    cost: string;
    markup: string;
    sellPrice: string;
};

const tabs: SettingsTab[] = ["set prices", "thresholds", "store management", "cost sheet"];

const priceRows: PriceRow[] = [
    { sku: "MAT-001", description: "Stainless Steel Bolts", cost: "0.45", markup: "35%", sellPrice: "$0.61" },
    { sku: "MAT-004", description: "Aluminum Sheet 2mm", cost: "125.00", markup: "35%", sellPrice: "$168.75" },
    { sku: "MAT-007", description: "Carbon Fiber Panel", cost: "450.00", markup: "40%", sellPrice: "$630.00" },
    { sku: "MAT-008", description: "Brass Fittings Pack", cost: "18.25", markup: "35%", sellPrice: "$24.64" },
];

const storeRows = [
    { name: "T-Shirt Store", status: "Active", updated: "Today" },
    { name: "Warehouse East", status: "Synced", updated: "2h ago" },
    { name: "Pop-up Market", status: "Draft", updated: "Yesterday" },
];

export function Settings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("set prices");

    const tabCopy = useMemo(
        () => ({
            "set prices": {
                title: "Preset pricing",
                subtitle: "Set a baseline cost and markup per SKU. Sell price updates automatically.",
            },
            thresholds: {
                title: "Anomaly thresholds",
                subtitle: "Define the price jump and margin rules that trigger review warnings.",
            },
            "store management": {
                title: "Store management",
                subtitle: "Rename or remove stores from one clean control surface.",
            },
            "cost sheet": {
                title: "Preset cost sheet",
                subtitle: "Upload a baseline sheet so unit cost values can populate automatically.",
            },
        }),
        []
    );

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050907] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(22,101,52,0.18),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_28%)]" />
            <div className="pointer-events-none absolute left-1/2 top-28 h-105 w-190 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

            <Header />

            <main className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-8 sm:py-10">
                <section className="rounded-[2rem] border border-white/8 bg-white/3 p-5 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.95)] backdrop-blur-md sm:p-7">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                <Settings2 className="h-3.5 w-3.5" />
                                Settings hub
                            </div>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                {tabCopy[activeTab].title}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
                                {tabCopy[activeTab].subtitle}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b120f] px-4 py-3 shadow-lg">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                <Layers3 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Current store</p>
                                <div className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
                                    T-Shirt Store
                                    <ChevronDown className="h-4 w-4 text-white/40" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-[#0b110f] p-2">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab;

                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={
                                        isActive
                                            ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#05110b] shadow-sm transition"
                                            : "rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
                                    }
                                >
                                    {tab === "set prices"
                                        ? "Set prices"
                                        : tab === "store management"
                                            ? "Store management"
                                            : tab === "cost sheet"
                                                ? "Preset cost sheet"
                                                : "Anomaly thresholds"}
                                </button>
                            );
                        })}
                    </div>

                    {activeTab === "set prices" && (
                        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
                            <section className="rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-white/35">Preset pricing</p>
                                        <h2 className="mt-2 text-lg font-semibold text-white">Markup rules per store</h2>
                                    </div>
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                        <Store className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
                                    <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm text-white/70">
                                        T-Shirt Store default markup rules, with overrides for selected SKUs.
                                    </div>
                                    <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm text-white/70">
                                        Save applies to the active store only.
                                    </div>
                                </div>

                                <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#0c1210]">
                                    <div className="grid grid-cols-[1.15fr_2fr_0.9fr_0.9fr_0.9fr] border-b border-white/8 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                                        <span>SKU</span>
                                        <span>Description</span>
                                        <span className="text-right">Cost</span>
                                        <span className="text-right">Markup</span>
                                        <span className="text-right">Sell price</span>
                                    </div>

                                    {priceRows.map((row) => (
                                        <div
                                            key={row.sku}
                                            className="grid grid-cols-[1.15fr_2fr_0.9fr_0.9fr_0.9fr] items-center border-b border-white/8 px-4 py-4 last:border-b-0"
                                        >
                                            <span className="text-sm font-medium text-blue-300">{row.sku}</span>
                                            <span className="pr-3 text-sm font-medium text-white">{row.description}</span>
                                            <div className="justify-self-end rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-sm font-semibold text-white">
                                                {row.cost}
                                            </div>
                                            <div className="justify-self-end rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-sm font-semibold text-white">
                                                {row.markup}
                                            </div>
                                            <div className="justify-self-end text-sm font-semibold text-white/80">
                                                {row.sellPrice}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm text-white/60">
                                    <span>Invoice average for MAT-001 is $0.48 · 7% above your preset</span>
                                    <button type="button" className="inline-flex items-center gap-2 text-emerald-300 transition hover:text-emerald-200">
                                        View rule history
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </section>

                            <aside className="space-y-4 rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5">
                                <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                    <p className="text-sm text-white/55">Quick summary</p>
                                    <p className="mt-2 text-xl font-semibold text-white">4 preset SKUs</p>
                                    <p className="mt-1 text-sm text-white/45">Ready to drive default sell prices</p>
                                </div>

                                <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                    <p className="text-sm text-white/55">Edit style</p>
                                    <div className="mt-3 space-y-2 text-sm text-white/70">
                                        <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#0c1210] px-3 py-2">
                                            <span>Cost locked to preset sheet</span>
                                            <PencilLine className="h-4 w-4 text-emerald-300" />
                                        </div>
                                        <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#0c1210] px-3 py-2">
                                            <span>Markup rolls into sell price</span>
                                            <LineChart className="h-4 w-4 text-emerald-300" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                                >
                                    Save pricing rules
                                </button>
                            </aside>
                        </div>
                    )}

                    {activeTab === "thresholds" && (
                        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.9fr)]">
                            <section className="rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-white/35">Alert rules</p>
                                        <h2 className="mt-2 text-lg font-semibold text-white">Anomaly thresholds</h2>
                                    </div>
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                        <p className="text-sm text-white/55">Price jump spike</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex-1 rounded-xl border border-white/8 bg-[#0c1210] px-3 py-2 text-sm font-semibold text-white">
                                                18%
                                            </div>
                                            <span className="text-xs text-white/40">count as spike</span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                        <p className="text-sm text-white/55">Margin loss floor</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex-1 rounded-xl border border-white/8 bg-[#0c1210] px-3 py-2 text-sm font-semibold text-white">
                                                12%
                                            </div>
                                            <span className="text-xs text-white/40">review below this</span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                        <p className="text-sm text-white/55">Stock mismatch variance</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex-1 rounded-xl border border-white/8 bg-[#0c1210] px-3 py-2 text-sm font-semibold text-white">
                                                3 units
                                            </div>
                                            <span className="text-xs text-white/40">before flagging</span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                        <p className="text-sm text-white/55">Tolerance window</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex-1 rounded-xl border border-white/8 bg-[#0c1210] px-3 py-2 text-sm font-semibold text-white">
                                                24h
                                            </div>
                                            <span className="text-xs text-white/40">between updates</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-2xl border border-white/8 bg-[#0c1210] p-4 text-sm text-white/65">
                                    These are placeholders only. The layout is meant to feel like a practical control panel, not a heavy settings form.
                                </div>
                            </section>

                            <aside className="rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Preview</p>
                                <h3 className="mt-2 text-lg font-semibold text-white">What gets flagged</h3>

                                <div className="mt-5 space-y-3">
                                    <div className="rounded-2xl border border-rose-500/15 bg-rose-500/10 p-4">
                                        <p className="text-sm font-medium text-rose-200">Price spike</p>
                                        <p className="mt-1 text-sm text-white/65">Invoice price jumps above the 18% threshold.</p>
                                    </div>
                                    <div className="rounded-2xl border border-amber-500/15 bg-amber-500/10 p-4">
                                        <p className="text-sm font-medium text-amber-200">Margin loss</p>
                                        <p className="mt-1 text-sm text-white/65">Sales under target margin enter the review queue.</p>
                                    </div>
                                    <div className="rounded-2xl border border-orange-500/15 bg-orange-500/10 p-4">
                                        <p className="text-sm font-medium text-orange-200">Stock mismatch</p>
                                        <p className="mt-1 text-sm text-white/65">Negative inventory variance is marked automatically.</p>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}

                    {activeTab === "store management" && (
                        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.9fr)]">
                            <section className="rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-white/35">Stores</p>
                                        <h2 className="mt-2 text-lg font-semibold text-white">Rename or delete stores</h2>
                                    </div>
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                        <Database className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {storeRows.map((store, index) => (
                                        <div
                                            key={store.name}
                                            className="rounded-2xl border border-white/8 bg-white/3 p-4"
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-base font-medium text-white">{store.name}</p>
                                                    <p className="mt-1 text-sm text-white/45">
                                                        {store.status} · updated {store.updated}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#0c1210] px-3 py-2 text-sm text-white/75 transition hover:text-white"
                                                    >
                                                        <PencilLine className="h-4 w-4 text-emerald-300" />
                                                        Rename
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/15"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {index === 0 && (
                                                <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-100">
                                                    Active store. Pricing and thresholds on this page reference the selected store.
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <aside className="space-y-4 rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5">
                                <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                    <p className="text-sm text-white/55">New store</p>
                                    <div className="mt-3 rounded-xl border border-white/8 bg-[#0c1210] px-3 py-2 text-sm text-white/45">
                                        Type a store name to create a new entry
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                    <p className="text-sm text-white/55">Safe operations</p>
                                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                                        Rename and delete actions are presented here as design placeholders so the interface reads like a real admin panel.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    )}

                    {activeTab === "cost sheet" && (
                        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.9fr)]">
                            <section className="rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-white/35">Cost sheet</p>
                                        <h2 className="mt-2 text-lg font-semibold text-white">Preset cost sheet upload</h2>
                                    </div>
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                        <CloudUpload className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                                    <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-emerald-400/20 bg-emerald-400/5 p-6 text-center transition hover:border-emerald-400/35 hover:bg-emerald-400/8">
                                        <Upload className="h-8 w-8 text-emerald-300" />
                                        <p className="mt-4 text-lg font-semibold text-white">Drop a preset cost sheet</p>
                                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">
                                            CSV or spreadsheet files can populate Unit Cost (Preset) so pricing rules stay consistent.
                                        </p>
                                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-4 py-2 text-sm text-white/70">
                                            Browse files
                                        </div>
                                    </label>

                                    <div className="space-y-3 rounded-[1.5rem] border border-white/8 bg-white/3 p-4">
                                        <div className="rounded-2xl border border-white/8 bg-[#0c1210] p-4">
                                            <p className="text-sm text-white/55">Expected columns</p>
                                            <p className="mt-2 text-sm text-white/75">SKU, Description, Unit Cost (Preset), Markup</p>
                                        </div>
                                        <div className="rounded-2xl border border-white/8 bg-[#0c1210] p-4">
                                            <p className="text-sm text-white/55">Auto-fill goal</p>
                                            <p className="mt-2 text-sm text-white/75">Price rows can hydrate from the uploaded baseline file.</p>
                                        </div>
                                        <div className="rounded-2xl border border-white/8 bg-[#0c1210] p-4">
                                            <p className="text-sm text-white/55">Status</p>
                                            <p className="mt-2 text-sm text-white/75">No file uploaded yet.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <aside className="rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Why it matters</p>
                                <h3 className="mt-2 text-lg font-semibold text-white">Keeps pricing grounded</h3>

                                <div className="mt-5 space-y-3">
                                    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                                            <Package2 className="h-4 w-4 text-emerald-300" />
                                            Standardizes unit cost
                                        </div>
                                        <p className="mt-2 text-sm leading-relaxed text-white/60">
                                            Preset values reduce drift when invoices vary from store to store.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                                            <LineChart className="h-4 w-4 text-emerald-300" />
                                            Improves anomaly detection
                                        </div>
                                        <p className="mt-2 text-sm leading-relaxed text-white/60">
                                            Better baseline data makes price spikes easier to spot later.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                                >
                                    Upload preset sheet
                                </button>
                            </aside>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}