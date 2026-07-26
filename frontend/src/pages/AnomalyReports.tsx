import {
    ArrowDownRight,
    ArrowUpRight,
    BadgeAlert,
    BarChart3,
    ChevronDown,
    CircleDollarSign,
    Filter,
    PackageX,
    ShieldAlert,
    Sparkles,
    TrendingDown,
} from "lucide-react";
import { useState } from "react";
import { Header } from "../assets/Header";

type ReportTab = "all" | "price spike" | "margin loss" | "stock mismatch";

type ReportItem = {
    type: Exclude<ReportTab, "all">;
    title: string;
    subtitle: string;
    detail: string;
    value: string;
    tone: string;
    icon: typeof ArrowUpRight;
};

const metrics = [
    {
        label: "Total flagged",
        value: "7",
        helper: "Across invoices and sales",
        icon: BadgeAlert,
    },
    {
        label: "Overcharge exposure",
        value: "$1,240",
        helper: "Estimated unapproved uplift",
        icon: CircleDollarSign,
    },
    {
        label: "Below-cost sales",
        value: "2",
        helper: "Items sold under target margin",
        icon: TrendingDown,
    },
];

const reports: ReportItem[] = [
    {
        type: "price spike",
        title: "Price spike — Cupcake Flour 25kg",
        subtitle: "Invoice #9931 · Samios",
        detail: "Usually $22.00 · this invoice $30.00 · 50 units · $400 above expected",
        value: "+36%",
        tone: "border-rose-500/30 bg-rose-500/10 text-rose-300",
        icon: ArrowUpRight,
    },
    {
        type: "margin loss",
        title: "Margin loss — SKU-009",
        subtitle: "Sold below cost on 20 Jul",
        detail: "Cost $22.00 · sold at $4.00 · 3 units · $54 loss",
        value: "-$18/unit",
        tone: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        icon: ArrowDownRight,
    },
    {
        type: "stock mismatch",
        title: "Stock mismatch — SKU-004",
        subtitle: "Sold more than was stocked",
        detail: "Stocked 5 · sold 17 · quantity went negative",
        value: "-12 units",
        tone: "border-orange-500/30 bg-orange-500/10 text-orange-300",
        icon: PackageX,
    },
    {
        type: "price spike",
        title: "Price spike — Kitchen Paper Towels",
        subtitle: "Invoice #1044 · CoreLink",
        detail: "Usually $9.80 · this invoice $13.20 · 24 units · $81.60 above expected",
        value: "+35%",
        tone: "border-rose-500/30 bg-rose-500/10 text-rose-300",
        icon: ArrowUpRight,
    },
    {
        type: "margin loss",
        title: "Margin loss — SKU-044",
        subtitle: "Promo sale on 22 Jul",
        detail: "Cost $16.50 · sold at $11.00 · 9 units · $49.50 loss",
        value: "-$5.50/unit",
        tone: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        icon: ArrowDownRight,
    },
    {
        type: "stock mismatch",
        title: "Stock mismatch — SKU-017",
        subtitle: "No corresponding replenishment",
        detail: "Stocked 14 · sold 21 · variance kept drifting negative",
        value: "-7 units",
        tone: "border-orange-500/30 bg-orange-500/10 text-orange-300",
        icon: PackageX,
    },
];

const tabs: ReportTab[] = ["all", "price spike", "margin loss", "stock mismatch"];

export function AnomalyReports() {
    const [activeTab, setActiveTab] = useState<ReportTab>("all");

    const visibleReports =
        activeTab === "all" ? reports : reports.filter((report) => report.type === activeTab);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050907] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(22,101,52,0.18),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_28%)]" />
            <div className="pointer-events-none absolute left-1/2 top-28 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

            <Header />

            <main className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-8 sm:py-10">
                <section className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.95)] backdrop-blur-md sm:p-7">
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
                                Issues found across your latest invoices and sales. This view is a polished placeholder for rapid review, with the dark-green Ledger Lens vibe carried through the layout.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b120f] px-4 py-3 shadow-lg">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Store</p>
                                <div className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
                                    T-Shirt Store
                                    <ChevronDown className="h-4 w-4 text-white/40" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {metrics.map((metric) => {
                            const MetricIcon = metric.icon;

                            return (
                                <div
                                    key={metric.label}
                                    className="rounded-2xl border border-white/8 bg-[#0c1210] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-white/55">{metric.label}</p>
                                            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                                {metric.value}
                                            </p>
                                            <p className="mt-2 text-xs text-white/38">{metric.helper}</p>
                                        </div>
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                            <MetricIcon className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-white/8 bg-black/20 p-1">
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
                                        {tab === "all" ? "All" : tab}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="ml-auto flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white/55">
                            <Filter className="h-4 w-4 text-emerald-300" />
                            Filtered placeholder results
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
                        <section className="space-y-4">
                            {visibleReports.map((report) => {
                                const ReportIcon = report.icon;

                                return (
                                    <article
                                        key={report.title}
                                        className="group rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-[#0d1512]"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-emerald-300">
                                                    <ReportIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-base font-semibold text-white sm:text-lg">{report.title}</h3>
                                                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                                                            {report.type}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-white/55">{report.subtitle}</p>
                                                </div>
                                            </div>

                                            <div
                                                className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${report.tone}`}
                                            >
                                                {report.value}
                                            </div>
                                        </div>

                                        <div className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-white/70">
                                            {report.detail}
                                        </div>
                                    </article>
                                );
                            })}

                            <div className="rounded-[1.5rem] border border-dashed border-emerald-400/20 bg-emerald-400/5 p-5 text-sm text-white/55">
                                Placeholder report content only. Tabs swap between static anomaly groups so the page feels interactive without introducing heavy functionality.
                            </div>
                        </section>

                        <aside className="rounded-[1.5rem] border border-white/8 bg-[#0b110f] p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/35">Report summary</p>
                                    <h2 className="mt-2 text-lg font-semibold text-white">At a glance</h2>
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                    <ShieldAlert className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                    <p className="text-sm text-white/55">Primary theme</p>
                                    <p className="mt-1 text-sm font-medium text-white">Dark green, low-glow, operational dashboard</p>
                                </div>

                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                    <p className="text-sm text-white/55">Visual tone</p>
                                    <p className="mt-1 text-sm font-medium text-white">Muted surfaces, crisp labels, warm alert accents</p>
                                </div>

                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                    <p className="text-sm text-white/55">Scope</p>
                                    <p className="mt-1 text-sm font-medium text-white">Static layout with local tab switching</p>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-2xl border border-rose-500/15 bg-rose-500/8 p-4">
                                    <p className="text-2xl font-semibold text-rose-200">3</p>
                                    <p className="mt-1 text-white/55">price spikes</p>
                                </div>
                                <div className="rounded-2xl border border-amber-500/15 bg-amber-500/8 p-4">
                                    <p className="text-2xl font-semibold text-amber-200">2</p>
                                    <p className="mt-1 text-white/55">margin leaks</p>
                                </div>
                                <div className="rounded-2xl border border-orange-500/15 bg-orange-500/8 p-4">
                                    <p className="text-2xl font-semibold text-orange-200">2</p>
                                    <p className="mt-1 text-white/55">stock mismatches</p>
                                </div>
                                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/8 p-4">
                                    <p className="text-2xl font-semibold text-emerald-200">7</p>
                                    <p className="mt-1 text-white/55">total flags</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </div>
    );
}