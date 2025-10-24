import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { TypeModule } from "@/design/types/module";
import { GetService } from "@/utils/api/connection";
import { useModules, usePortfolio, useUser } from "@/utils/api/queries";
import { ArrowLeft, ArrowRight, Github, Puzzle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom"

export default function Modules({ children }: {
    children: React.ReactNode
}) {
    const { id } = useParams();
    const portfolio = usePortfolio(id!);
    const user = useUser();
    const modules = useModules(portfolio.data.template);
    const [selectedModule, setSelectedModule] = useState<TypeModule | null>(null)
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="flex flex-col">
                <div className="flex items-center gap-2">
                    {selectedModule && <ArrowLeft className="cursor-pointer" onClick={() => setSelectedModule(null)} />}
                    <DialogTitle>Modules</DialogTitle>
                </div>
                {(!selectedModule) && modules.data?.map((x) => (
                    <div
                        onClick={() => setSelectedModule(x)}
                        className="bg-[#333]/80 justify-between hover:bg-[#333] border-[#262626] border-2 p-3 rounded-lg transition-all duration-200 flex items-center gap-2.5 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Puzzle className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-300">{x.name}</span>
                        </div>

                        <ArrowRight className="w-4 h-4" />
                    </div>
                ))}

                {selectedModule && (
                    <div className="flex flex-col gap-2">
                        {(selectedModule.require == "oauth:github" && !user.data?.connections?.find(x => x.service == "github")) && (
                            <div className="flex items-center gap-2 bg-[#444444]/20 border border-[#444444] p-2 rounded-lg">
                                <div className="bg-[#333] p-1 rounded-lg">
                                    <Github />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-sm items-center gap-2">
                                        <button
                                            onClick={async () => {
                                                const r = await GetService("github")
                                                window.location.href = r.data.url
                                            }}
                                            className="py-1 text-xs disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-gray-500 disabled:cursor-not-allowed px-2 max-w-min rounded-lg bg-gray-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-gray-600 text-white cursor-pointer font-semibold transition">
                                            Connect
                                        </button>

                                        <p> your <b>GitHub</b> account to use this module</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-lg font-bold text-gray-200">{selectedModule.name}</h1>
                            </div>
                            <button
                                className="py-1 text-xs disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-gray-500 disabled:cursor-not-allowed px-2 rounded-lg bg-green-500 border-b-6 disabled:border-gray-400/50 border-green-400/50 hover:translate-y-0.5 disabled:bg-gray-500 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                                disabled={selectedModule.require == "oauth:github" && !user.data?.connections?.find(x => x.service == "github")}
                            >
                                Enable Module
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog >
    )
}