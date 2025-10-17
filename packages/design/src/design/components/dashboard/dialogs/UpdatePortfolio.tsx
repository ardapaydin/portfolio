import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { TypePortfolio } from "@/design/types/portfolio";
import { updatePortfolio } from "@/utils/api/portfolio";
import { usePortfolio } from "@/utils/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UpdatePortfolio({ children, portfolioId }: { children: React.ReactNode, portfolioId?: string }) {
    const params = useParams();
    const qc = useQueryClient();
    const id = params.id || portfolioId;
    const [isOpen, setIsOpen] = useState(false);
    if (!id) return
    const portfolio = usePortfolio(id!, isOpen);
    const [form, setForm] = useState({
        name: "",
        subdomain: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    useEffect(() => {
        setForm({
            name: portfolio.data?.name,
            subdomain: portfolio.data?.subdomain
        });
    }, [isOpen, portfolio.data]);

    const update = async () => {
        const x = await updatePortfolio(id, form.name, form.subdomain);
        if (x.status == 200) {
            const get = qc.getQueryData(["portfolio", id]) as TypePortfolio;
            qc.setQueryData(["portfolio", id], {
                ...get,
                name: form.name,
                subdomain: form.subdomain
            })
            setIsOpen(false);
        }
        else setErrors(x.data.errors)
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Name</label>
                        {errors.name && <p className="text-sm text-red-400">{errors.name[0]}</p>}
                        <input type="text" className="p-2 rounded-lg bg-[#333] border-[#262626] border-4 focus:outline-none" value={form.name} onChange={(e) => {
                            setErrors({})
                            setForm({ ...form, name: e.target.value })
                        }} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Subdomain</label>
                        {errors.subdomain && <p className="text-sm text-red-400">{errors.subdomain[0]}</p>}
                        <input type="text" className="p-2 rounded-lg bg-[#333] border-[#262626] border-4 focus:outline-none" value={form.subdomain} onChange={(e) => {
                            setErrors({})
                            setForm({ ...form, subdomain: e.target.value })
                        }} />
                    </div>
                    <div className="justify-end flex">
                        <button className="mt-4 py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                            disabled={!form.name || form.name.length < 3 || Object.keys(errors).length > 0 || !/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(form.subdomain)}
                            onClick={update}
                        >
                            Update
                        </button>
                    </div>
                </div>

            </DialogContent>
        </Dialog >
    )
}