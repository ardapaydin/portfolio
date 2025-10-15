import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NewPortfolio } from "@/utils/api/portfolio";
import { useEffect, useState } from "react";

export default function CreatePortfolio({ children, templateId }: { children: React.ReactNode, templateId: string }) {
    const [form, setForm] = useState({
        name: "",
        template: templateId
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (!isOpen) setForm({ name: "", template: templateId });
    }, [isOpen, templateId]);

    const create = async () => {
        const req = await NewPortfolio(form.name, form.template);

        if (!req.data.success) setErrors(req.data.errors);
        else {
            setErrors({});
            setIsOpen(false);
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
                        <input type="text" className="p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        {form.name &&
                            <p className="text-sm text-gray-400">
                                Subdomain will be: <span className="font-mono text-green-400">{form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</span>
                            </p>
                        }
                    </div>
                    <div className="justify-end flex">
                        <button className="mt-4 py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                            disabled={!form.name}
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