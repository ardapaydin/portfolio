import { usePortfolio, usePortfolioDraft } from "@/utils/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Cloud } from "lucide-react";
import { useParams } from "react-router-dom";
import DraftDetails from "../dialogs/DraftDetails";

export default function Topbar() {
    const { id } = useParams();
    const { data: portfolio } = usePortfolio(id!);
    const qc = useQueryClient();
    qc.setQueryData(["data"], portfolio?.data);
    const draft = usePortfolioDraft(id!);
    return (
        <div className="flex items-center h-12 rounded-t-lg bg-[#0e0d0d] border-b border-black px-6 shadow-sm">
            <div className="flex space-x-2 mr-6">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-md" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-md" />
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-md" />
            </div>
            <div className="flex-1 text-center">
                <span className="text-base font-semibold text-gray-100 truncate">
                    {portfolio?.name}
                </span>
            </div>

            {draft.data?.updatedAt && (
                <div className="text-xs text-gray-400 cursor-pointer">
                    <DraftDetails>
                        {draft.data?.updating ? (
                            <div className="flex items-center gap-1">
                                <Cloud className="w-4 h-4 animate-pulse" />
                                Saving Draft...
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <Cloud className="w-4 h-4 inline-block" />
                                Saved Draft
                            </div>
                        )}
                    </DraftDetails>
                </div>
            )}
        </div>
    )
}