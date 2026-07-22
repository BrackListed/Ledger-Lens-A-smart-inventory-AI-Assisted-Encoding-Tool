import { Upload, ArrowRight, Check, Sparkles, Zap, RefreshCw } from "lucide-react";
import { Header } from "../assets/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import { Navigate, useNavigate } from "react-router-dom";

export function Dashboard() {
  interface storeType{
    id: string
    name: string
    created_at: string
  }
  const [fileName, setFileName] = useState("")
  const [file, setFile] = useState<File | undefined>(undefined)
  const [storeName, setStoreName] = useState("")
  const [stores, setStores] = useState<storeType[]>([])
  const [addedStore, setAddedStore] = useState(false)
  const {isLoaded, userId, getToken} = useAuth()
  const [selectedStore, setSelectedStore] = useState<storeType | undefined>(undefined)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchStoreData = async() => {
      const token = await getToken()
      const result = await axios.get("http://localhost:5000/store", {headers: {Authorization: `Bearer ${token}`}})
      setStores(result.data)
    }
    if(addedStore){
      setTimeout(() => {
        setAddedStore(false)
      }, 1000);
      fetchStoreData()
    }
  }, [addedStore])

  useEffect(() => {
    const fetchStoreData = async() => {
      const token = await getToken()
      const result = await axios.get("http://localhost:5000/store", {headers: {Authorization: `Bearer ${token}`}})
      setStores(result.data)
    }
    fetchStoreData()
  }, [])

  if(!isLoaded) return null
  if(!userId) return <Navigate to = "/intermission" replace />
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060a09] text-white">
      <div className="pointer-events-none absolute left-1/2 top-40 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

    <Header/>

      <main className="relative z-10 mx-auto max-w-6xl px-8 py-16">
        <h1 className="text-center text-3xl font-semibold leading-tight sm:text-4xl">
          Upload Your <span className="text-emerald-400">PDF</span> or{" "}
          <span className="text-emerald-400">Excel</span> Invoice Here
        </h1>
        <p className="mt-2 text-center text-xs text-white/40">
          Must have pdf/excel file &amp; selected store
        </p>


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
                onChange={(e) => {setFileName(e.target.files?.[0]?.name ?? ""); setFile(e.target.files?.[0])}}
              />
            </label>

            {(file && selectedStore) && <button onClick={() => encode(selectedStore.id, fileName, file, selectedStore)} className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-emerald-950 hover:cursor-pointer hover:bg-emerald-500">
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

        <div className="mx-auto mt-10 flex max-w-xl items-start justify-center gap-6">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/3 p-4">
            <p className="text-xs font-medium text-white/50">Select Store</p>
            <div className="mt-3 space-y-2">
              {stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(selectedStore?.id === store.id ? undefined : store)}
                  className={
                    selectedStore?.id === store.id
                      ? "cursor-pointer rounded-lg border border-emerald-400/50 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300"
                      : "cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
                  }
                >
                  {store.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <p className="mb-3 text-xs font-medium text-white/50">Create a New Store</p>
            <input
              placeholder="Store name"
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30"
              onChange={(e) => setStoreName(e.target.value)}
            />
            <button onClick={() => createStore(storeName)} className="mt-2 w-full rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-emerald-950 hover:cursor-pointer hover:bg-emerald-500">
              Create Store
            </button>
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

  async function createStore(name: string){
    const token = await getToken()
    const result = await axios.post("http://localhost:5000/create/store", {name: name}, {headers: {Authorization: `Bearer ${token}`}})
    setAddedStore(result.data)
  }

  async function encode(storeId: string, name: string, file: File, store: storeType){
    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", name)
    const token = await getToken()
    const result = await axios.post(`http://localhost:5000/encode/${storeId}`, formData, {headers: {Authorization: `Bearer ${token}`}})
    if(result.data.status) {
      navigate("/encoder", {state: {store}})
    } else{
      alert(result.data.message)
    }
  }
}