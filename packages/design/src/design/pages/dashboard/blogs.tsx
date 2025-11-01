import CreateBlog from "@/design/components/dashboard/dialogs/Blog/CreateBlog";
import DeleteBlogDialog from "@/design/components/dashboard/dialogs/Blog/DeleteBlog";
import Layout from "@/design/components/dashboard/layout";
import { LoadingSmall } from "@/design/components/loading";
import { useBlogs } from "@/utils/api/queries";
import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Blogs() {
    const blogs = useBlogs();
    const nav = useNavigate();
    return (
        <Layout>
            <div className="flex flex-col">
                <div className="items-center justify-between flex">
                    <h1 className="font-bold text-xl">Blogs</h1>
                    <CreateBlog>
                        <button className="mt-4 py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                            Create Blog
                        </button>
                    </CreateBlog>
                </div>
            </div>
            {blogs.isLoading && <LoadingSmall />}
            {
                (!blogs.isLoading && !blogs.isError && Array.isArray(blogs.data)) &&
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
                    {blogs.data.map((blog) => (
                        <div className="bg-[#222222] rounded-md flex flex-col border shadow-lg border-[#303030]">
                            <div className="flex flex-col px-8 py-4">
                                <div className="flex justify-between items-center">
                                    <h1 className="font-bold">
                                        {blog.name}
                                    </h1>
                                </div>
                            </div>
                            <hr className="border-[#303030]" />

                            <div className="flex gap-2 justify-between items-center px-8 pb-6 pt-4">
                                <button
                                    onClick={() => {
                                        nav(`/dashboard/blogs/${blog.id}`)
                                    }}
                                    className="py-0.5 flex items-center gap-1 px-2 rounded-lg bg-green-500 border-b-8 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                                >
                                    Edit <Pencil className="w-4" />
                                </button>

                                <div className="flex">
                                    <DeleteBlogDialog id={blog.id}>
                                        <Trash className="w-5 cursor-pointer text-red-500/50 hover:text-red-500 transition" />
                                    </DeleteBlogDialog>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            }
        </Layout>
    )
}