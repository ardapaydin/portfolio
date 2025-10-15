import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-1 h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 min-h-0">
                <Navbar />
                <div className="p-4 flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}