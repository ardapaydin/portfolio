import readtime from "@/blog/utils/readtime";
import UserAvatar from "@/design/components/user/avatar";
import type { TypeBlogPost } from "@/design/types/blogPost";

export default function PostInfo({ post }: { post: TypeBlogPost }) {
    return (
        <>
            <div className="flex flex-row gap-2 flex-wrap">
                {post.tags.map((tag) => (
                    <div className="bg-blue-600 p-1 font-bold rounded-lg uppercase px-2">
                        {tag}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 items-start">
                <h1 className="text-2xl font-bold">
                    {post.title}
                </h1>
                {post.isDraft && (
                    <div className="border-[#333] border-dashed border-2 flex text-xs px-2 py-1 rounded">
                        Draft
                    </div>
                )}
            </div>

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
        </>
    )
}