import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-1 h-screen">
            <Sidebar />
            <div className="flex flex-col overflow-auto flex-1 min-h-0">
                <div className="p-4 flex-1 max-w-7xl py-16 mx-auto w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}