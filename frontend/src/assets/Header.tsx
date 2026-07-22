import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Header(){
    const location = useLocation();

    return(
        <header className="relative z-10 flex items-center justify-between border-b border-white/5 px-8 py-4 bg-[#060a09] text-white">
            <div className="text-lg font-semibold tracking-tight">
                Ledger <span className="text-emerald-400">Lens</span>
            </div>

            <nav className="flex items-center gap-8 text-sm">
                <Link to="/">
                    <span className={
                        location.pathname === "/"
                            ? "relative text-white after:absolute after:-bottom-4 after:left-0 after:h-0.5 after:w-full after:bg-emerald-400"
                            : "text-white/50 transition hover:text-white"
                    }>
                        Dashboard
                    </span>
                </Link>
                <Link to="/encoder">
                    <span className={
                        location.pathname === "/encoder"
                            ? "relative text-white after:absolute after:-bottom-4 after:left-0 after:h-0.5 after:w-full after:bg-emerald-400"
                            : "text-white/50 transition hover:text-white"
                    }>
                        Automated Encoder
                    </span>
                </Link>
                <span className="text-white/50 transition hover:text-white">Anomaly Reports</span>
                <span className="text-white/50 transition hover:text-white">Settings</span>
            </nav>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <User className="h-4 w-4 text-white/70" />
            </div>
        </header>
    )
}