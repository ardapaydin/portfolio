import type { TypeTemplate } from "@/design/types/template";
import { usePortfolio, useTemplate } from "@/utils/api/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ListSidebar({ keyName, mode, index, setSelectedList }: {
    keyName: string, mode: "edit" | "create", index?: number, setSelectedList: (value: null) => void
}) {
    const qc = useQueryClient();
    const { id } = useParams();
    const portfolio = usePortfolio(id!);
    const template = useTemplate(portfolio.data.template)
    const data = useQuery({
        queryKey: ["data"],
        queryFn: async () => ({} as TypeTemplate),
    }).data as TypeTemplate | undefined;
    const [create, setCreate] = useState<{ [key: string]: string }>({ name: "", url: "" });
    const validation = () => {
        const isValidUrl = (url: string) => /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/.test(url);
        if (mode === "create") {
            if (create.name.trim() === "" || create.url.trim() === "") return false;
            if (!isValidUrl(create.url)) return false;
        }
        return true;
    }
    const keys = Object.keys(template.data.fields[keyName]?.item)
    const values = Object.values(template.data.fields[keyName]?.item) as { label: string, type: string }[]
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => { setSelectedList(null) }} />
                <h2 className="text-2xl font-semibold">{mode === "edit" ? "Edit" : "New"} Item</h2>
            </div>
            <div className="flex-1">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col text-left gap-3">
                        {keys.map((key, i) => (
                            <>
                                <label className="mb-1 text-sm font-medium text-gray-200">{values[i].label}</label>
                                {values[i].type == "string" &&
                                    <input
                                        type="text"
                                        value={data ? data[keyName][index!]?.[key] : ""}
                                        onChange={(e) => {
                                            const newList = [...(qc.getQueryData<any>(["data"])?.[keyName] || [])];
                                            newList[index!] = { ...newList[index!], [key]: e.target.value };
                                            qc.setQueryData(["data"], { ...qc.getQueryData(["data"]), [keyName]: newList });
                                            if (mode === "create") setCreate({ ...create, [key]: e.target.value });
                                        }}
                                        className="w-full p-2 rounded-lg bg-[#333] border-2 border-[#262626] focus:outline-none"
                                    />
                                }

                                {values[i].type === "link" &&
                                    <div className="flex items-center">
                                        <span className="px-2 py-2 rounded-l-lg bg-[#222] border-2 border-r-0 border-[#262626] text-gray-400 select-none">
                                            https://
                                        </span>
                                        <input
                                            type="text"
                                            value={
                                                mode === "create"
                                                    ? create[key].replace(/^https?:\/\//, "")
                                                    : (data ? data[keyName][index!]?.[key].replace(/^https?:\/\//, "") : "")
                                            }
                                            onChange={(e) => {
                                                const urlValue = "https://" + e.target.value.replace(/^https?:\/\//, "");
                                                if (mode === "create") {
                                                    setCreate({ ...create, [key]: urlValue });
                                                } else {
                                                    const newList = [...(qc.getQueryData<any>(["data"])?.[keyName] || [])];
                                                    newList[index!] = { ...newList[index!], [key]: urlValue };
                                                    qc.setQueryData(["data"], { ...qc.getQueryData(["data"]), [keyName]: newList });
                                                }
                                            }}
                                            required
                                            className="w-full p-2 rounded-r-lg bg-[#333] border-2 border-[#262626] focus:outline-none"
                                            placeholder="your-site.com"
                                        />
                                    </div>

                                }
                            </>
                        ))}
                        <div className="flex gap-4 mt-4 justify-end">
                            {mode === "edit" && <button
                                onClick={() => {
                                    const newList = [...(qc.getQueryData<any>(["data"])?.[keyName] || [])];
                                    newList.splice(index!, 1);
                                    qc.setQueryData(["data"], { ...qc.getQueryData(["data"]), [keyName]: newList });
                                    setSelectedList(null);
                                }}
                                className="px-2 py-2 rounded-lg cursor-pointer bg-red-500 text-white"
                            >
                                <Trash />
                            </button>}

                            {mode === "create" && <button
                                onClick={() => {
                                    const newList = [...(qc.getQueryData<any>(["data"])?.[keyName] || [])];
                                    newList.push({ name: create.name, url: create.url });
                                    qc.setQueryData(["data"], { ...qc.getQueryData(["data"]), [keyName]: newList });
                                    setSelectedList(null);
                                    setCreate({ name: "", url: "" });
                                }}
                                disabled={!validation()}
                                className="px-2 py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-green-500 text-white"
                            >
                                <Plus />
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}