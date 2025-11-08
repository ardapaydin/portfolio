import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { TypeModule } from "@/design/types/module";
import { GetService } from "@/utils/api/connection";
import { useModules, usePortfolio, useUser } from "@/utils/api/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Github, Gitlab, Puzzle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom"
import EditModule from "./Edit";

export default function Modules({ children }: {
    children: React.ReactNode
}) {
    const { id } = useParams();
    const portfolio = usePortfolio(id!);
    const user = useUser();
    const modules = useModules(portfolio.data.template);
    const [selectedModule, setSelectedModule] = useState<TypeModule | null>(null)
    const qc = useQueryClient()

    const enableModule = (module: TypeModule) => qc.setQueryData(["data"], (old: any) => ({ ...old, modules: [module.id, ...(old?.modules || [])] }));
    const disableModule = (module: TypeModule) => qc.setQueryData(["data"], (old: any) => ({ ...old, modules: old.modules?.filter((x: number) => x != module.id) }))

    const d = useQuery({ queryKey: ["data"] }) as { data: { modules: number[] } }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="flex flex-col">
                <div className="flex items-center gap-2">
                    {selectedModule && <ArrowLeft className="cursor-pointer" onClick={() => setSelectedModule(null)} />}
                    <DialogTitle>{selectedModule ? selectedModule.name : "Modules"}</DialogTitle>
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
                        {["github", "gitlab", "discord"].map(service => {
                            const isRequired = selectedModule.require === `oauth:${service}`;
                            const isConnected = user.data?.connections?.find(x => x.service === service);
                            const iconsMap: Record<string, React.ElementType> = {
                                github: Github,
                                gitlab: Gitlab,
                                discord: () => (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5 text-gray-400"
                                    >
                                        <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.211.375-.444.864-.608 1.249a18.97 18.97 0 0 0-5.527 0 12.298 12.298 0 0 0-.617-1.249.077.077 0 0 0-.078-.037A19.791 19.791 0 0 0 3.683 4.369a.07.07 0 0 0-.032.027C.533 9.136-.32 13.736.099 18.289a.082.082 0 0 0 .031.056 19.963 19.963 0 0 0 5.993 3.038.076.076 0 0 0 .084-.027c.462-.63.873-1.295 1.226-1.989a.076.076 0 0 0-.041-.106 13.098 13.098 0 0 1-1.872-.9.077.077 0 0 1-.008-.128c.126-.095.252-.192.373-.291a.075.075 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.075.075 0 0 1 .079.008c.121.099.247.196.373.291a.077.077 0 0 1-.006.128 12.646 12.646 0 0 1-1.873.9.076.076 0 0 0-.041.106c.36.694.772 1.359 1.226 1.989a.076.076 0 0 0 .084.027 19.963 19.963 0 0 0 5.994-3.038.082.082 0 0 0 .031-.056c.5-5.177-.838-9.736-3.552-13.893a.061.061 0 0 0-.03-.028ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.334.955-2.428 2.157-2.428 1.21 0 2.184 1.103 2.166 2.428 0 1.334-.955 2.419-2.166 2.419Zm7.943 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.334.955-2.428 2.157-2.428 1.21 0 2.184 1.103 2.166 2.428 0 1.334-.956 2.419-2.166 2.419Z" />
                                    </svg>
                                ),
                            };
                            const Icon = iconsMap[service];

                            if (!isRequired) return null;

                            return (
                                <div className="flex items-center gap-2 bg-[#444444]/20 border border-[#444444] p-2 rounded-lg">
                                    <div className="bg-[#333] p-1 rounded-lg">
                                        <Icon />
                                    </div>
                                    <div className="flex text-sm items-center gap-2">
                                        <button
                                            onClick={async () => {
                                                const r = await GetService(service);
                                                window.location.href = r.data.url;
                                            }}
                                            className="py-1 text-xs px-2 max-w-min rounded-lg bg-gray-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-gray-600 text-white cursor-pointer font-semibold transition disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-gray-500 disabled:cursor-not-allowed">
                                            {isConnected ? 'Reconnect' : 'Connect'}
                                        </button>
                                        <p>{isConnected ? 'for refresh your informations' : `your ${service.charAt(0).toUpperCase() + service.slice(1)} account to use this module`}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {selectedModule.id == 4 && (
                            <div className="bg-orange-500/50 border flex gap-2 border-orange-500 p-2 rounded">
                                <button
                                    onClick={() => window.open("https://discord.com/invite/UrXF2cfJ7F", "_blank")}
                                    className="py-1 text-xs px-2 max-w-min rounded-lg bg-orange-500 border-b-6 border-orange-400/50 hover:translate-y-0.5 hover:bg-orange-600 text-white cursor-pointer font-semibold transition disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-gray-500 disabled:cursor-not-allowed">
                                    Join
                                </button>

                                <p className="text-xs">
                                    This module uses Lanyard to fetch RPCs. You must join Lanyard's Discord server for this module to work correctly.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-4">
                            <h1 className="text-lg font-bold text-gray-200">Configure Module</h1>
                            <button
                                onClick={() => d.data?.modules?.find(x => x == selectedModule.id) ? disableModule(selectedModule) : enableModule(selectedModule)}
                                className={`py-1 text-xs px-2 rounded-lg ${d.data?.modules?.find(x => x == selectedModule.id) ? 'bg-red-500 hover:bg-red-600 border-red-400/50' : 'bg-green-500 hover:bg-green-600 border-green-400/50'} border-b-6 text-white cursor-pointer font-semibold transition disabled:opacity-50 disabled:hover:translate-y-0 disabled:bg-gray-500 disabled:cursor-not-allowed`}
                                disabled={selectedModule.require.startsWith("oauth:") && !user.data?.connections?.find(x => x.service === selectedModule.require.split("oauth:")[1])}
                            >
                                {d.data?.modules?.find(x => x == selectedModule.id) ? "Disable" : "Enable"} Module
                            </button>
                        </div>

                        <EditModule module={selectedModule} />
                    </div>
                )}
            </DialogContent>
        </Dialog >
    )
}