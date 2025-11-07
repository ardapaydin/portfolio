import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import TagInput from "../Post/TagInput";

export default function PostDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        title: "",
        content: "",
        tags: [] as string[]
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({})

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="h-screen min-w-screen">
                <div className="flex flex-col max-w-4xl mt-32 mx-auto w-full">
                    <h1 className="text-2xl font-bold mb-4">Create Post</h1>
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold">Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="px-4 py-3 rounded-lg bg-[#313131] border-b-3 border-[#242323] text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-semibold">Tags</label>
                            <TagInput value={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-start gap-2">
                                <label className="font-semibold">Content</label>
                                <span className="bg-[#333] px-2 py-0.5 rounded text-xs">Markdown supported</span>
                            </div>
                            <textarea
                                rows={12}
                                className="px-4 py-3 rounded-lg bg-[#313131] border-b-3 border-[#242323] text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"

                            />
                        </div>

                        <div className="flex justify-end gap-1">
                            <button className="mt-4 py-2 disabled:opacity-50 flex items-center gap-1 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 rounded-lg border border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-gray-600 text-white cursor-pointer font-semibold transition">
                                Save as Draft
                            </button>

                            <button className="mt-4 py-2 disabled:opacity-50 flex items-center gap-1 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}