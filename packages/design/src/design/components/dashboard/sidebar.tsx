import { Home, LayoutTemplate, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Step from "./step";


export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`h-screen ${collapsed ? "w-20" : "w-72"} border-r border-[#333] bg-[#1d1d1d]/80 text-white transition-all duration-200`}>
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
                <span className={`font-bold text-lg transition-opacity duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>Dashboard</span>
                <button
                    className="p-2 rounded hover:bg-[#333]/50 transition z-20 cursor-pointer"
                    onClick={() => setCollapsed((c) => !c)}
                    aria-label="Toggle sidebar"
                >
                    <Menu />
                </button>
            </div>
            {collapsed || <Step />}
            <div className="p-4 flex flex-col border-b border-[#333]">
                {[
                    { name: "Portfolios", href: "/dashboard", icon: <Home /> },
                    { name: "Templates", href: "/dashboard/templates", icon: <LayoutTemplate /> }
                ].map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-[#333]/60 transition group ${window.location.pathname === item.href ? "bg-[#333]/60" : ""}`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className={`transition-all duration-200 text-sm ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
                            {item.name}
                        </span>
                    </Link>
                ))}
            </div>

        </div>
    );
}