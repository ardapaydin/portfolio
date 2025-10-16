import { Home, LayoutTemplate, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Step from "./step";
import User from "./user";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`h-screen flex flex-col ${collapsed ? "w-20" : "w-80"} border-r-3 border-[#262626] bg-[#222222] text-white transition-all duration-200`}>
            <div>
                <div className="flex items-center justify-between p-4 border-b-4 border-[#262626]">
                    <span className={`font-bold text-lg transition-opacity duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto px-3"}`}>
                        {import.meta.env.VITE_APP_NAME}
                    </span>
                    <button
                        className="p-2 rounded hover:bg-[#262626]/50 transition z-20 cursor-pointer"
                        onClick={() => setCollapsed((c) => !c)}
                        aria-label="Toggle sidebar"
                    >
                        <Menu />
                    </button>
                </div>
                {collapsed || <Step />}
                <div className="p-4 flex flex-col gap-2 border-b border-[#262626]">
                    {[
                        { name: "Portfolios", href: "/dashboard", icon: <Home /> },
                        { name: "Templates", href: "/dashboard/templates", icon: <LayoutTemplate /> }
                    ].map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center gap-3 py-4 px-3 rounded-lg hover:bg-[#262626]/60 transition group ${window.location.pathname === item.href ? "bg-green-500/5 text-green-500" : "text-white/50"}`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className={`transition-all duration-200 text-sm ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="p-4 border-t bg-[#191919] border-[#262626] mt-auto">
                <User collapsed={collapsed} />
            </div>
        </div>
    );
}