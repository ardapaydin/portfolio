import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import TagInput from "../Post/TagInput";
import { CreateBlogPost } from "@/utils/api/blog";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Delete, Image, Plus } from "lucide-react";
import { UploadBlogBanner } from "@/utils/api/attachments";

export default function PostDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const { id } = useParams();
    const [form, setForm] = useState({
        title: "",
        content: "",
        image: null as string | null,
        tags: [] as string[]
    });
    const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string[]>>>({})
    const qc = useQueryClient();
    const post = async (draft: boolean) => {
        const r = await CreateBlogPost(id!, form.title, form.content, form.tags, form.image, draft);
        if (r?.data?.success) {
            qc.setQueryData(["blog", id], (old: any) => ({
                ...old,
                posts: [
                    r.data.data,
                    ...old.posts,
                ]
            }))
            setIsOpen(false);
            setForm({ title: "", content: "", tags: [], image: null })
        }
        else {
            setErrors(r?.data?.errors || { "title": ["Internal server error"] })
        }
    }

    useEffect(() => { setErrors({}) }, [form])
    const uploadbanner = async (e: React.DragEvent | React.ChangeEvent) => {
        e.preventDefault();
        const f = ('dataTransfer' in e ? e.dataTransfer?.files : (e.target as HTMLInputElement)?.files)?.[0];
        if (!f) return;
        const objectUrl = URL.createObjectURL(f);
        setForm(prev => ({ ...prev, image: objectUrl }));
        const fd = new FormData();
        fd.append("file", f);
        fd.append("blogId", id!)
        const res = await UploadBlogBanner(fd)
        if (res?.status == 200 && res?.data?.id) setForm(prev => ({ ...prev, image: res.data.id }));
        else setErrors(prev => ({ ...prev, image: ["Upload failed"] }));

    }
    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="h-screen min-w-screen overflow-auto">
                <div className="flex flex-col max-w-4xl mt-12 mx-auto w-full">
                    <h1 className="text-2xl font-bold mb-4">Create Post</h1>
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold">Banner</label>
                            {errors.image && <p className="text-red-400">{errors.image[0]}</p>}
                            <div className="bg-[#333] w-full h-64 rounded">

                                <div
                                    className="w-full h-full cursor-pointer justify-center items-center flex relative"
                                    onClick={() => document.getElementById("input-img")?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => uploadbanner(e)}
                                >
                                    <input
                                        id="input-img"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => uploadbanner(e)}
                                    />

                                    {form.image ? (
                                        <>
                                            <img src={`${form.image.startsWith("blob:") ? form.image : import.meta.env.VITE_S3_URL}blogPostBanner/${form.image}`} className="object-cover w-full h-full" />

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (form.image && form.image.startsWith("blob:")) try { URL.revokeObjectURL(form.image); } catch { }
                                                    setForm(prev => ({ ...prev, image: null }));
                                                }}
                                                className="absolute top-2 right-2 bg-black/40 text-white px-2 py-1 rounded hover:bg-black/60"
                                            >
                                                <Delete />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full h-full cursor-pointer justify-center items-center flex flex-col gap-2">
                                            <div className="relative w-12">
                                                <Image className="w-12 h-12 opacity-50" />
                                            </div>
                                            <div className="text-sm text-white/80">Click or drop an image to upload</div>
                                            <div className="text-xs text-muted-foreground">Recommended: 1200x300</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-semibold">Title</label>
                            {errors.title && <p className="text-red-400">{errors.title[0]}</p>}
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="px-4 py-3 rounded-lg bg-[#313131] border-b-3 border-[#242323] text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-semibold">Tags</label>
                            {errors.tags && <p className="text-red-400">{errors.tags[0]}</p>}

                            <TagInput value={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-start gap-2">
                                <label className="font-semibold">Content</label>
                                {errors.content && <p className="text-red-400">{errors.content[0]}</p>}

                                <span className="bg-[#333] px-2 py-0.5 rounded text-xs">Markdown supported</span>
                            </div>
                            <textarea
                                rows={12}
                                className="px-4 py-3 rounded-lg bg-[#313131] border-b-3 border-[#242323] text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-1">
                            <button disabled={Object.keys(errors).length != 0} onClick={() => post(true)} className="mt-4 py-2 disabled:opacity-50 flex items-center gap-1 disabled:hover:translate-y-0 disabled:hover:bg-transparent disabled:cursor-not-allowed px-4 rounded-lg border border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-gray-600 text-white cursor-pointer font-semibold transition">
                                Save as Draft
                            </button>

                            <button disabled={Object.keys(errors).length != 0} onClick={() => post(false)} className="mt-4 py-2 disabled:opacity-50 flex items-center gap-1 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}