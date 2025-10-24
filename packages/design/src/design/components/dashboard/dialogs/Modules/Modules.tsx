import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useModules, usePortfolio } from "@/utils/api/queries";
import { ArrowLeft, ArrowRight, Puzzle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom"

export default function Modules({ children }: {
    children: React.ReactNode
}) {
    const { id } = useParams();
    const portfolio = usePortfolio(id!);
    const modules = useModules(portfolio.data.template);
    const [selectedModule, setSelectedModule] = useState<string | null>(null)
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
                        onClick={() => setSelectedModule(x.id)}
                        className="bg-[#333]/80 justify-between hover:bg-[#333] border-[#262626] border-2 p-3 rounded-lg transition-all duration-200 flex items-center gap-2.5 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Puzzle className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-300">{x.name}</span>
                        </div>

                        <ArrowRight className="w-4 h-4" />
                    </div>
                ))}

                {selectedModule && (
                    <div className="flex flex-col">

                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}