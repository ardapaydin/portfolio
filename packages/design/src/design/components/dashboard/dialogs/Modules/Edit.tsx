import { LoadingSmall } from "@/design/components/loading";
import type { TypeModule } from "@/design/types/module";
import { UpdateModuleConfig } from "@/utils/api/module";
import { getPortfolioModule } from "@/utils/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EditModule({ module }: { module: TypeModule }) {
    const { id } = useParams();
    const d = getPortfolioModule(id!, module.id);

    const [form, setForm] = useState<Record<string, any>>({})
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const qc = useQueryClient();
    const update = async () => {
        const u = await UpdateModuleConfig(id!, module.id, form);
        if (u.status == 200) {
            qc.setQueryData(["portfolio", id, "modules", module.id], (old: any) => ({
                ...old,
                config: form
            }))
        } else setErrors(u.data.errors)
    }
    useEffect(() => { if (d.data) setForm(d.data?.config) }, [d.data])
    useEffect(() => { setErrors({}) }, [form])
    if (d.isLoading) return <LoadingSmall />
    return (
        <>
            <div className="grid grid-cols-2 mt-2">
                {Object.keys(module.config.fields).map((x, i) => {
                    const value = Object.values(module.config.fields)[i]
                    return (
                        <div className="flex flex-col gap-2">
                            <div className="text-sm text-muted-foreground">{value.label}</div>
                            {errors[x] && <p className="text-red-500">{errors[x][0]}</p>}
                            {value.type == "number" && <input
                                type="number"
                                value={Number(form.max)}
                                onChange={(e) => setForm({ ...form, [x]: Number(e.target.value) })}
                                className="w-full p-2 h-12 rounded-lg bg-[#333] border-[#262626] border-4 focus:outline-none"
                            />}
                            {value.type == "enum" && <select
                                value={form.sort}
                                onChange={(e) => setForm({ ...form, [x]: e.target.value })}
                                className="w-full p-2 h-12 rounded-lg bg-[#333] border-[#262626] border-4 focus:outline-none"
                            >
                                {value.options?.map((option: string) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>}

                            {value.type == "string" && <input
                                type="text"
                                value={form.branch}
                                onChange={(e) => setForm({ ...form, [x]: e.target.value })}
                                className="w-full p-2 h-12 rounded-lg bg-[#333] border-[#262626] border-4 focus:outline-none"
                            />}
                        </div>
                    )
                })}
            </div>

            <div className="justify-end flex">
                <button className="mt-4 py-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                    onClick={() => update()}
                    disabled={JSON.stringify(d.data?.config) === JSON.stringify(form)}
                >
                    Update
                </button>
            </div>

        </>

    )
}