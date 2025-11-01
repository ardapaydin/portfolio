import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { TypeBlog } from "@/design/types/blog";
import { DeleteBlog } from "@/utils/api/blog";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function DeleteBlogDialog({ children, id }: { children: React.ReactNode, id: string }) {
    const [error, setError] = useState(false)
    const [confirm, setConfirm] = useState("");
    const qc = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const deleteblog = async () => {
        const r = await DeleteBlog(id);
        if (r.status != 200) return setError(true);
        setIsOpen(false);
        setConfirm("");
        qc.setQueryData(["blogs"], (old: TypeBlog[]) => old.filter((blog) => blog.id !== id))
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Delete Blog</h1>
                    {error && <span className="text-red-500">An unknown error occured.</span>}
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
                        Write <span className="text-red-300 font-mono">confirm</span> to delete blog.
                    </div>


                    <div className="flex justify-end">
                        <button
                            onClick={() => deleteblog()}
                            disabled={confirm.toLowerCase() != "confirm"}
                            className="py-0.5 px-2 rounded-lg bg-red-500 border-b-8 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-red-500 border-gray-400/50 hover:translate-y-0.5 hover:bg-red-600 text-white cursor-pointer font-semibold transition"
                        >
                            Delete Blog
                        </button>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    )
}