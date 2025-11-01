import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { NewBlog } from "@/utils/api/blog";
import { useState } from "react"

export default function CreateBlog({ children }: {
    children: React.ReactNode
}) {
    const [form, setForm] = useState({
        name: ""
    });

    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [isOpen, setIsOpen] = useState(false);

    const create = async () => {
        const blog = await NewBlog(form.name);
        if (!blog.data.success) setErrors(blog.data.errors || { name: ["Internal server error"] });
        else {
            setErrors({})
            setIsOpen(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">
                        Create Blog
                    </h2>
                    <div className=" flex flex-col gap-2">
                        <label className="font-semibold">Name</label>
                        {errors.name && <p className="text-sm text-red-400">{errors.name[0]}</p>}
                        <input type="text" className="p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none" value={form.name} onChange={(e) => {
                            setErrors({})
                            setForm({ ...form, name: e.target.value })
                        }} />
                    </div>

                    <div className="justify-end flex">
                        <button className="mt-4 py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                            disabled={!form.name || !form.name.trim() || Object.keys(errors).length > 0}
                            onClick={create}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}