import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { deletePortfolioBlog, setPortfolioBlog } from "@/utils/api/portfolio";
import { useBlogs, usePortfolio } from "@/utils/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Notebook } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function SetBlog({ children }: { children: React.ReactNode }) {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const blogs = useBlogs(isOpen);
    const portfolio = usePortfolio(id!);
    const qc = useQueryClient();
    const selectblog = async (blogId: string) => {
        if (portfolio.data.blogId == blogId) return;
        const req = await setPortfolioBlog(id!, blogId);
        if (req.status == 200) {
            setIsOpen(false);
            qc.setQueryData(["portfolio", id], (old: any) => ({
                ...old,
                blogId
            }))
        }
    }
    const delblog = async () => {
        const req = await deletePortfolioBlog(id!);
        if (req.status == 200) {
            setIsOpen(false);
            qc.setQueryData(["portfolio", id], (old: any) => ({
                ...old,
                blogId: null
            }))
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <h1 className="font-bold">Select Blog</h1>
                <div className="flex flex-col">
                    {blogs.data?.map((blog) => (
                        <div
                            onClick={() => selectblog(blog.id)}
                            className="bg-[#333]/80 justify-between hover:bg-[#333] border-[#262626] border-2 p-3 rounded-lg transition-all duration-200 flex items-center gap-2.5 cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Notebook className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-gray-300">{blog.name}</span>
                            </div>
                            {blog.id == portfolio.data.blogId && <Check className="w-4 h-4 text-green-500" />}
                        </div>
                    ))}
                </div>
                {portfolio.data.blogId && (
                    <div className="flex justify-end">
                        <button
                            onClick={() => delblog()}
                            className="py-0.5 px-2 rounded-lg bg-red-500 border-b-8 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-red-500 border-gray-400/50 hover:translate-y-0.5 hover:bg-red-600 text-white cursor-pointer font-semibold transition"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}