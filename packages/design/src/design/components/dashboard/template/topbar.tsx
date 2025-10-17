import { usePortfolio, usePortfolioDraft } from "@/utils/api/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cloud, Image, Settings } from "lucide-react";
import { useParams } from "react-router-dom";
import DraftDetails from "../dialogs/DraftDetails";
import Attachments from "../dialogs/Attachments";
import type { TypeDraft } from "@/design/types/draft";
import UpdatePortfolio from "../dialogs/UpdatePortfolio";

export default function Topbar() {
    const { id } = useParams();
    const { data: portfolio } = usePortfolio(id!);
    const qc = useQueryClient();
    const draft = usePortfolioDraft(id!);
    const data = useQuery({ queryKey: ["data"], queryFn: () => { } }) as unknown as TypeDraft;
    return (
        <div className="flex items-center h-12 rounded-t-lg bg-[#0e0d0d] border-b border-black px-6 shadow-sm">
            <div className="flex space-x-2 mr-6">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-md" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-md" />
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-md" />
            </div>
            <div className="flex-1 flex items-center justify-center cursor-pointer gap-2">
                <Attachments onSelect={(uuid: string) => {
                    const data = qc.getQueryData(["data"]) as any;
                    qc.setQueryData(["data"], {
                        meta: {
                            ...data.meta,
                            favicon: uuid,
                        },
                        ...data,
                    });
                }}>
                    <div className="w-7 h-7 bg-white/10 flex items-center justify-center rounded">
                        <Image className="w-5 h-5 opacity-30" />
                        {data?.data?.meta?.favicon && (
                            <img className="w-7 h-7" src={`${import.meta.env.VITE_S3_URL}attachments/${data?.data?.meta?.favicon}`} />
                        )}
                    </div>
                </Attachments>
                <span
                    className="text-base font-semibold text-gray-100 truncate"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                        const title = e.currentTarget.textContent?.trim();
                        if (!title || title === portfolio?.name) return;
                        const data = qc.getQueryData(["data"]) as any;
                        qc.setQueryData(["data"], {
                            ...data,
                            meta: {
                                ...data.meta,
                                title,
                            },
                        });
                    }}
                >
                    {portfolio?.name}
                </span>
            </div>

            <div className="flex items-center gap-3">

                {(draft.data?.updatedAt != draft.data?.createdAt) && (
                    <>
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
                        <hr className="w-3" />
                    </>
                )}


                <UpdatePortfolio>
                    <div className="text-muted-foreground hover:text-white transition-all cursor-pointer">
                        <Settings className="w-5" />
                    </div>
                </UpdatePortfolio>
            </div>
        </div>
    )
}