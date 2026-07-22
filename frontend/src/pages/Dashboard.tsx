import { Upload, ArrowRight, Check, Sparkles, Zap, RefreshCw } from "lucide-react";
import { Header } from "../assets/Header";
import { useState } from "react";

export function Dashboard() {
  const [fileName, setFileName] = useState("")
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060a09] text-white">
      <div className="pointer-events-none absolute left-1/2 top-40 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

    <Header/>

      <main className="relative z-10 mx-auto max-w-6xl px-8 py-16">
        <h1 className="text-center text-3xl font-semibold leading-tight sm:text-4xl">
          Upload Your <span className="text-emerald-400">PDF</span> or{" "}
          <span className="text-emerald-400">Excel</span> Invoice Here
        </h1>



        <div className="mt-14 flex items-center justify-center gap-4">
          <div className="hidden shrink-0 -rotate-6 rounded-lg border border-white/10 bg-white/95 p-3 shadow-xl sm:block">
            <div className="w-28 space-y-1.5">
              <div className="h-2 w-3/4 rounded-sm bg-neutral-800" />
              <div className="h-1.5 w-full rounded-sm bg-neutral-300" />
              <div className="h-1.5 w-full rounded-sm bg-neutral-300" />
              <div className="h-1.5 w-2/3 rounded-sm bg-emerald-300" />
              <div className="h-1.5 w-full rounded-sm bg-neutral-300" />
              <div className="h-1.5 w-1/2 rounded-sm bg-neutral-300" />
              <div className="mt-3 h-1.5 w-full rounded-sm bg-neutral-300" />
              <div className="h-1.5 w-2/3 rounded-sm bg-emerald-300" />
            </div>
          </div>

          <ArrowRight className="h-5 w-5 text-white/30" />
          <div className="flex shrink-0 flex-col items-center gap-4">
            <label
              htmlFor="invoice-upload"
              className="relative flex h-64 w-64 shrink-0 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-400/30 bg-linear-to-b from-emerald-500/10 to-transparent text-center shadow-[0_0_60px_-10px_rgba(16,185,129,0.35)]"
            >
              <div className="absolute inset-0 rounded-2xl border border-dashed border-white/15" />
              <Upload className="h-8 w-8 text-emerald-400" />
              <p className="px-6 text-sm font-medium text-white/90">
                {fileName ? (
                  fileName
                ) : (
                  <>
                    Upload Your
                    <br />
                    PDF or Excel Invoice Here
                  </>
                )}
              </p>
              <input
                id="invoice-upload"
                type="file"
                accept=".pdf,.xls,.xlsx"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </label>

            {fileName && <button className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-emerald-950">
              Send to automated encoder
            </button>}
          </div>

          <ArrowRight className="h-5 w-5 text-white/30" />

          <div className="relative hidden shrink-0 rotate-3 rounded-lg border border-white/10 bg-[#0d1412] p-3 shadow-xl sm:block">
            <span className="absolute -top-3 right-2 flex items-center gap-1 rounded-full bg-emerald-400 px-2.5 py-1 text-[10px] font-semibold text-emerald-950">
              <Check className="h-3 w-3" />
              Verified
            </span>
            <div className="w-40 space-y-1">
              <div className="flex gap-1 border-b border-white/10 pb-1">
                <div className="h-1.5 w-1/2 rounded-sm bg-white/40" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/40" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/40" />
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 w-1/2 rounded-sm bg-white/15" />
                <div className="h-1.5 w-1/4 rounded-sm bg-emerald-400/60" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/15" />
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 w-1/2 rounded-sm bg-white/15" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/15" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/15" />
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 w-1/2 rounded-sm bg-white/15" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/15" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/15" />
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 w-1/2 rounded-sm bg-white/15" />
                <div className="h-1.5 w-1/4 rounded-sm bg-emerald-400/60" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/15" />
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 w-1/2 rounded-sm bg-white/15" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/15" />
                <div className="h-1.5 w-1/4 rounded-sm bg-white/15" />
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-lg font-semibold text-white/90">Feature Highlights</h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">AI-Powered Extraction</p>
                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  AI powered extraction pulls line items straight off messy vendor invoices.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Groq Speed Inference</p>
                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  Groq speed inference parses documents in a fraction of a second.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                <RefreshCw className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Instant ERP Sync</p>
                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  Instant ERP sync keeps ledgers reconciled the moment data lands.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">AI-Powered Extraction</p>
                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  AI powered extraction pulls line items straight off messy vendor invoices.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Groq Speed Inference</p>
                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  Groq speed inference parses documents in a fraction of a second.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                <RefreshCw className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Instant ERP Sync</p>
                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  Instant ERP sync keeps ledgers reconciled the moment data lands.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
