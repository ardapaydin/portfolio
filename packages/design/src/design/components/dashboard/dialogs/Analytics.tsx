import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import ViewInsights from "./Analytics/ViewInsights";
import { Glasses, ScanEye } from "lucide-react";
import EngagementMetrics from "./Analytics/EngagementMetrics";

export default function Analytics({ children }: {
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState("viewInsights")

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="md:max-w-2xl mx-auto rounded-xl shadow-xl p-8 text-center">
                <div className="flex gap-2 border-b mb-4">
                    <button
                        className={`px-3 py-2 flex items-center gap-1 transition-colors cursor-pointer ${page === "viewInsights"
                            ? "border-b-2 border-green-500 font-semibold text-green-500"
                            : "text-white/50 hover:text-green-500"
                            }`}
                        onClick={() => setPage("viewInsights")}
                    >
                        <ScanEye className="w-5" />
                        View Insights
                    </button>
                    <button
                        className={`px-3 py-2 flex gap-1 items-center transition-colors cursor-pointer ${page === "engagementMetrics"
                            ? "border-b-2 border-green-500 font-semibold text-green-500"
                            : "text-white/50 hover:text-green-500"
                            }`}
                        onClick={() => setPage("engagementMetrics")}
                    >
                        <Glasses className="w-5" />
                        Engagement Metrics
                    </button>
                </div>

                {page == "viewInsights" && <ViewInsights isOpen={isOpen} />}
                {page == "engagementMetrics" && <EngagementMetrics isOpen={isOpen} />}
            </DialogContent>
        </Dialog>
    )
}