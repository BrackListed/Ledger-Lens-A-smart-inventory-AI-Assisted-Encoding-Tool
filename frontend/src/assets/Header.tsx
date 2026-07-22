import { UserButton } from "@clerk/react";
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

            <UserButton
                appearance={{
                    elements: {
                        avatarBox: "h-9 w-9 ring-2 ring-emerald-400/40 ring-offset-2 ring-offset-[#060a09]",
                        userButtonPopoverCard: "bg-[#0d1412] border border-white/10 shadow-xl",
                        userButtonPopoverMain: "bg-[#0d1412]",
                        userPreviewMainIdentifier: "text-white",
                        userPreviewSecondaryIdentifier: "text-white/50",
                        userButtonPopoverActionButton: "text-white/80 hover:bg-white/5",
                        userButtonPopoverActionButtonIcon: "text-white/60",
                        userButtonPopoverActionButtonText: "text-white/80",
                        userButtonPopoverFooter: "hidden",
                    },
                }}
            />
        </header>
    )
}