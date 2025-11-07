import { useBlog, useBlogFromSubdomain } from "@/utils/api/queries"
import { useParams } from "react-router-dom"
import PostInfo from "../components/Post/info";
import { ArrowLeft, Pencil, TrashIcon } from "lucide-react";
import Markdown from "react-markdown";
import MarkdownComponents from "@/templates/global/Markdown";
import { isDashboard } from "../utils/isDashboard";
import EditDialog from "../components/Dialogs/Edit";
import DeleteDialog from "../components/Dialogs/Delete";

export default function PostPage() {
    const { id, postId: postid } = useParams();
    const subdomain = process.env.NODE_ENV === "production"
        ? window.location.hostname.split('.')[0]
        : window.location.pathname.match(/\/view\/([^/]+)/)?.[1]!;
    const postId = subdomain ? window.location.pathname.match(/\/posts\/([^/]+)/)?.[1] : postid
    const dashboard = isDashboard()
    const blog = dashboard ? useBlog(id!) : useBlogFromSubdomain(subdomain!)

    const post = blog.data?.posts.find(post => post.id == postId);
    if (!post) return
    return (
        <div className="flex flex-col max-w-7xl mx-auto w-full pt-64">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            <ArrowLeft onClick={() => window.history.back()} className="text-white/50 hover:text-white z-10 transition-all cursor-pointer mb-2" />
            <div className="flex flex-col gap-2 z-20">
                <div className="w-full h-72 bg-[#333] rounded-lg">
                    {post.image && <img src={`${import.meta.env.VITE_S3_URL}blogPostBanner/${post.image}`} className="object-cover rounded w-full h-full" />}
                </div>
                <div className="items-start justify-between flex">
                    <div className="flex flex-col">
                        <PostInfo post={post} />
                    </div>

                    {dashboard && (
                        <div className="flex gap-2 border-b border-white/50 rounded">
                            <EditDialog post={post}>
                                <Pencil className="w-4 opacity-50 hover:opacity-100 mb-2 transition-all cursor-pointer h-4" />
                            </EditDialog>
                            <DeleteDialog post={post}>
                                <TrashIcon className="w-4 opacity-50 hover:opacity-100 transition-all cursor-pointer h-4 text-red-400" />
                            </DeleteDialog>
                        </div>
                    )}
                </div>

                <Markdown components={MarkdownComponents({ dataKey: "blog-" + postId })}>{post.content}</Markdown>
            </div>
        </div>
    )
}