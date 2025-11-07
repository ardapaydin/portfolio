import { useBlog } from "@/utils/api/queries"
import { isDashboard } from "./utils/isDashboard"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "@/design/components/loading";
import PostInfo from "./components/Post/info";
import { FileWarning, Plus } from "lucide-react";
import PostPage from "./pages/Post";
import PostDialog from "./components/Dialogs/Post";

export default function Blog() {
    const { id, postId } = useParams();
    const dashboard = isDashboard()
    const blog = useBlog(id!)
    const nav = useNavigate();
    if (blog.isLoading) return <Loading />
    if (!blog.data?.success) return (
        <div className="h-screen px-2 text-center w-screen flex flex-col justify-center border-2 border-dashed border-muted-foreground/50 rounded items-center">
            <FileWarning className="w-15 h-15 mb-2 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-2">Blog Not Found</h1>
            <p className="text-muted-foreground text-lg">
                The requested blog does not exist or is not published yet.
            </p>
        </div>
    )
    if (postId) return <PostPage />
    return (
        <div className="flex max-w-7xl mx-auto flex-col w-full">
            <div className="uppercase text-sm pt-64 tracking-widest text-white/50 mb-4" style={{
                letterSpacing: "0.3rem"
            }}>
                Blog
            </div>

            <div className="relative break-words z-20 mb-2">
                <span className="relative break-words text-5xl font-bold">
                    {blog.data?.name}
                    <span className="absolute left-0 bottom-0 w-64 h-7 -z-1" />
                </span>

                <p className="text-sm max-w-xl my-4 text-muted-foreground">
                    Discover my thoughts, experiences, and insights on various topics through my blog.
                </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            {dashboard && (
                <div className="flex justify-end z-10">
                    <PostDialog>
                        <button className="mt-4 py-2 disabled:opacity-50 flex items-center gap-1 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                        >
                            <Plus />
                            New Post
                        </button>
                    </PostDialog>
                </div>
            )}

            <div className="flex flex-col z-20">
                {blog.data?.posts.map((post, i) => (
                    <div onClick={() => nav("posts/" + post.id)} className={`flex p-2 gap-8 rounded w-full opacity-90 hover:opacity-100 transition-all cursor-pointer flex-row${i % 2 == 1 ? "-reverse" : ""} flex justify-between`}>
                        <div className="w-2/3 h-72 bg-[#333] rounded-lg">
                            {post.image && <img src={`${import.meta.env.VITE_S3_URL}blogPostBanner/${post.image}`} className="object-cover w-full h-full" />}
                        </div>
                        <div className="w-1/3 gap-4 flex flex-col">
                            <PostInfo post={post} />
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}