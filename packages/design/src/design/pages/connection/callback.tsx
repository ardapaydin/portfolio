import Loading from "@/design/components/loading";
import { ServiceCallback } from "@/utils/api/connection";
import { useParams } from "react-router-dom"

export default function Callback() {
    const { service } = useParams();
    const code = new URLSearchParams(window.location.search).get("code");
    const r = ServiceCallback(service ?? "", code ?? "", service ? ["github", "gitlab"].includes(service) : false)
    if (r.isLoading) return <Loading />
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#242424]/50 backdrop-blur-sm">
            {((!service || !["github", "gitlab"].includes(service)) || !r.data?.success) && (
                <div className="flex flex-col gap-4 text-center">
                    <div className="text-red-500 bg-[#313131] flex-col flex border border-red-500/50 font-bold px-8 py-5 rounded-lg shadow-lg">
                        {(!service || !["github"].includes(service))
                            ? "Invalid Service"
                            : "An error occurred while processing your request"}
                        <button
                            onClick={() => window.location.href = "/"}
                            className="py-1 text-xs disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-gray-500 disabled:cursor-not-allowed px-2 rounded-lg bg-gray-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-gray-600 text-white cursor-pointer font-semibold transition"
                        >
                            Return to Home
                        </button>

                    </div>
                </div>
            )}

            {r.data.success && (
                <div className="flex flex-col gap-4 text-center">
                    <div className="text-green-500 bg-[#313131] flex-col flex border border-green-500/50 font-bold px-8 py-5 rounded-lg shadow-lg">
                        Successfully connected
                        <button
                            onClick={() => window.location.href = "/"}
                            className="py-1 text-xs disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-gray-500 disabled:cursor-not-allowed px-2 rounded-lg bg-gray-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-gray-600 text-white cursor-pointer font-semibold transition"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#0f0_100%)]" />
            <div className="absolute inset-0 -z-10 h-full w-full opacity-20 bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:16px_16px]" />

        </div>
    )
}