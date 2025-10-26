import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NewPortfolio } from "@/utils/api/portfolio";
import { useEffect, useState } from "react";

export default function CreatePortfolio({ children, templateId }: { children: React.ReactNode, templateId: string }) {
    const [form, setForm] = useState({
        name: "",
        subdomain: "",
        template: templateId
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (!isOpen) setForm({ name: "", subdomain: "", template: templateId });
    }, [isOpen, templateId]);

    const create = async () => {
        const req = await NewPortfolio(form.name, form.template, form.subdomain);

        if (!req.data.success) setErrors(req.data.errors);
        else {
            setErrors({});
            setIsOpen(false);
            window.location.href = `/dashboard/portfolio/${req.data.portfolio.id}/edit`;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Create Portfolio</h2>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Name</label>
                        {errors.name && <p className="text-sm text-red-400">{errors.name[0]}</p>}
                        <input type="text" className="p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none" value={form.name} onChange={(e) => {
                            setErrors({})
                            setForm({ ...form, name: e.target.value })
                        }} />
                        <p className="text-sm text-gray-400">The name of your portfolio. You can change this later. <span className="font-mono text-red-400">Minimum 3 characters.</span></p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Subdomain</label>
                        {errors.subdomain && <p className="text-sm text-red-400">{errors.subdomain[0]}</p>}
                        <input type="text" className="p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none" value={form.subdomain} onChange={(e) => {
                            setErrors({})
                            setForm({ ...form, subdomain: e.target.value })
                        }} />
                    </div>
                    <div className="justify-end flex">
                        <button className="mt-4 py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                            disabled={!form.name || form.name.length < 3 || Object.keys(errors).length > 0}
                            onClick={create}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}