
export default function Navbar() {
    return (
        <div className="border-b border-[#363738] sticky top-0 bg-black/50 backdrop-blur-sm z-50">
            <div className="max-w-7xl mx-auto">
                <div className="transition-all p-6 z-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">
                            {import.meta.env.VITE_APP_NAME}
                        </h1>
                    </div>
                    <div className="gap-4 hidden md:flex">
                        <button
                            onClick={() => {
                                window.location.href = import.meta.env.VITE_DESIGN_DOMAIN + "/auth/login";
                            }}
                            className="cursor-pointer relative font-semibold px-4 py-2 text-center transition-all rounded-full border-transparent bg-transparent text-white hover:bg-green-500/10">Sign In</button>
                        <button
                            onClick={() => {
                                window.location.href = import.meta.env.VITE_DESIGN_DOMAIN + "/auth/register";
                            }}
                            className="cursor-pointer relative font-semibold px-4 py-2 text-center transition-all rounded-full bg-green-500 text-black">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}