import { SignInButton, SignUpButton } from "@clerk/react";
import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";

export function Intermission(){
    const {isLoaded, userId} = useAuth()
    if(!isLoaded) return null
    if(userId) return <Navigate to = "/" replace/>
    return(
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#060a09] text-white">
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-105 w-180 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-2xl font-semibold tracking-tight">
                    Ledger <span className="text-emerald-400">Lens</span>
                </div>

                <p className="mt-3 max-w-sm text-sm text-white/50">
                    Sign in to your account or create a new one to keep tracking your invoices.
                </p>

                <div className="mt-8 flex items-center gap-3">
                    <SignInButton mode="modal">
                        <button className="rounded-md border border-white/15 px-5 py-2 text-sm text-white/80">
                            Sign In
                        </button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                        <button className="rounded-md bg-emerald-400 px-5 py-2 text-sm font-medium text-emerald-950">
                            Sign Up
                        </button>
                    </SignUpButton>
                </div>
            </div>
        </div>
    )
}
