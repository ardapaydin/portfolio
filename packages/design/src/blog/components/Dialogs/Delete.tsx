import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { TypeBlogPost } from "@/design/types/blogPost";
import { DeletePost } from "@/utils/api/blog";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function DeleteDialog({ children, post }: { children: React.ReactNode, post: TypeBlogPost }) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState(false);
    const qc = useQueryClient();
    const { id, postId } = useParams();
    const deletepost = async () => {
        const r = await DeletePost(id!, post.id)
        if (r.status == 200) {
            setConfirm("");
            setIsOpen(false)
            qc.setQueryData(["blog", id], (old: { name: string, posts: TypeBlogPost[] }) => ({ ...old, posts: old.posts.filter((p) => p.id !== post.id) }))
            if (postId == post.id) window.history.back()
        } else setError(true)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Delete Post</h1>
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
                        Write <span className="text-red-300 font-mono">confirm</span> to delete post.
                    </div>


                    <div className="flex justify-end">
                        <button
                            onClick={() => deletepost()}
                            disabled={confirm.toLowerCase() != "confirm"}
                            className="py-0.5 px-2 rounded-lg bg-red-500 border-b-8 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-red-500 border-gray-400/50 hover:translate-y-0.5 hover:bg-red-600 text-white cursor-pointer font-semibold transition"
                        >
                            Delete Post
                        </button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}