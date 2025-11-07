import { useBlog } from "@/utils/api/queries"
import { isDashboard } from "./utils/isDashboard"
import { useParams } from "react-router-dom"
import Loading from "@/design/components/loading";
import UserAvatar from "@/design/components/user/avatar";
import readtime from "./utils/readtime";

export default function Blog() {
    const { id } = useParams();
    const dashboard = isDashboard()
    const blog = useBlog(id!)
    if (blog.isLoading) return <Loading />
    if (!blog.data?.success) return <div>Blog not found</div>
    return (
        <div className="flex max-w-7xl mx-auto flex-col w-full">
            <div className="w-full py-4">
            </div>
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

            <div className="flex flex-col">
                {blog.data?.posts.map((post, i) => (
                    <div className={`flex p-2 gap-8 rounded w-full opacity-90 hover:opacity-100 transition-all cursor-pointer flex-row${i % 2 == 1 ? "-reverse" : ""} flex justify-between`}>
                        <div className="w-2/3 h-72 bg-[#333] rounded-lg">
                            {post.image && <img src={`${import.meta.env.VITE_S3_URL}blogPostBanner/${post.image}`} className="object-cover w-full h-full" />}
                        </div>
                        <div className="w-1/3 gap-4 flex flex-col">
                            <div className="flex flex-row gap-2 flex-wrap">
                                {post.tags.map((tag) => (
                                    <div className="bg-blue-600 p-1 font-bold rounded-lg uppercase px-2">
                                        {tag}
                                    </div>
                                ))}
                            </div>

                            <h1 className="text-2xl font-bold">
                                {post.title}
                            </h1>

                            <div className="flex items-center gap-2">
                                <UserAvatar userData={post.createdBy} />
                                <div className="flex flex-col">
                                    <span className="font-semibold">{post.createdBy.name}</span>

                                    <div className="flex text-xs gap-1">
                                        <span>
                                            {new Date(post.createdAt).toLocaleString()}
                                        </span>
                                        <span className="font-bold">-</span>
                                        <span>{readtime(post.content)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}