import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import MainAttachments from "./Attachments/Main";
import { ListCollapse, Plus } from "lucide-react";
import UploadAttachment from "./Attachments/Upload";

export default function Attachments({ children, onSelect }: { children: React.ReactNode, onSelect: (uuid: string) => void; }) {
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState("attachments")

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="md:max-w-3xl">
                <div className="flex flex-col">
                    <div className="flex gap-2 border-b mb-4">
                        <button
                            className={`px-3 py-2 flex items-center gap-1 transition-colors cursor-pointer ${page === "attachments"
                                ? "border-b-2 border-green-500 font-semibold text-green-500"
                                : "text-white/50 hover:text-green-500"
                                }`}
                            onClick={() => setPage("attachments")}
                        >
                            <ListCollapse className="w-5" />
                            Attachments
                        </button>
                        <button
                            className={`px-3 py-2 flex gap-1 items-center transition-colors cursor-pointer ${page === "upload"
                                ? "border-b-2 border-green-500 font-semibold text-green-500"
                                : "text-white/50 hover:text-green-500"
                                }`}
                            onClick={() => setPage("upload")}
                        >
                            <Plus className="w-5" />
                            Upload
                        </button>
                    </div>
                    <div className="mt-2" />
                    {page == "attachments" && <MainAttachments onSelect={onSelect} />}
                    {page == "upload" && <UploadAttachment onSelect={onSelect} />}
                </div>
            </DialogContent>
        </Dialog>
    )
}