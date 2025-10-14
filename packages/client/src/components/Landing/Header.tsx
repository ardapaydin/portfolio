export default function Header() {
    return (
        <div className="border-[#363738]">
            <div className="max-w-7xl mx-auto">

                <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

                <div className="border-x border-[#363738] md:px-20 md:py-12 p-2">
                    <div className="py-30 p-6 mx-auto flex flex-col justify-between items-center text-center gap-6">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
                            Build Your Portfolio in
                            <span className="relative inline-block ml-3">
                                <span className="text-green-500">Minutes</span>
                                <span className="absolute -bottom-1 left-0 w-full h-1 bg-green-500/20 rounded-full" />
                            </span>
                        </h1>
                        <p className="text-xl mb-10 text-balance">
                            Choose from our curated collection of portfolio templates. Customize the content, deploy instantly, and showcase your work to the world.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button
                                onClick={() => {
                                    window.location.href = import.meta.env.VITE_DESIGN_DOMAIN + "/auth/register";
                                }}
                                className="cursor-pointer relative font-semibold px-4 text-xl py-2 text-center transition-all rounded-full bg-green-500 text-black w-full sm:w-auto">
                                Get Started
                            </button>
                        </div>

                        <div className="mt-6 flex flex-row gap-6 w-full sm:w-auto justify-center">
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <div className="p-1 rounded-full bg-green-500" />
                                <p>Free to start</p>
                            </div>

                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <div className="p-1 rounded-full bg-blue-500" />
                                <p>No coding skills required</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}