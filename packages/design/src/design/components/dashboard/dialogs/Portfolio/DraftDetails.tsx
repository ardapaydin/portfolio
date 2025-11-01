import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DeleteDraft } from "@/utils/api/portfolio";
import { usePortfolio, usePortfolioDraft } from "@/utils/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function DraftDetails({
    children
}: {
    children: React.ReactNode;
}) {
    const { id } = useParams();
    const draft = usePortfolioDraft(id!);
    const portfolio = usePortfolio(id!);
    const [isOpen, setIsOpen] = useState(false);
    const [confirm, setConfirm] = useState("");
    const qc = useQueryClient();
    const deleteDraft = async () => {
        const deletereq = await DeleteDraft(id!);
        if (deletereq.status != 204) return
        qc.setQueryData(["data"], { ...portfolio.data.data })
        setIsOpen(false);
        setConfirm("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">
                        Draft
                    </h1>
                    <p className="text-white/50 text-sm">
                        Last updated at {new Date(draft.data?.updatedAt!).toLocaleTimeString()}
                    </p>
                    <div className="flex flex-col gap-2 mt-4 mb-2">
                        <input
                            type="text"
                            className="w-full p-2 px-4 rounded-lg bg-[#333] focus:outline-none"
                            value={confirm}
                            placeholder="CONFIRM or confirm or CoNfIrm"
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>

                    <div className="text-xs text-white/50">
                        Write <span className="text-red-300 font-mono uppercase">confirm</span> to delete draft.
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={deleteDraft}
                            disabled={confirm.toLowerCase() != "confirm"}
                            className="py-0.5 px-2 rounded-lg bg-red-500 border-b-8 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-red-500 border-gray-400/50 hover:translate-y-0.5 hover:bg-red-600 text-white cursor-pointer font-semibold transition"
                        >
                            Delete Draft
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}