import type { TypeTemplate } from "@/design/types/template";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { useState } from "react";

export default function ListSidebar({ keyName, mode, value, index, setSelectedList }: {
    keyName: string, mode: "edit" | "create", value?: {
        name: string, url: string
    }, index?: number, setSelectedList: (value: null) => void
}) {
    const qc = useQueryClient();
    const data = useQuery({
        queryKey: ["data"],
        queryFn: async () => ({} as TypeTemplate),
    }).data as TypeTemplate | undefined;
    const [create, setCreate] = useState({ name: "", url: "" });
    const validation = () => {
        const isValidUrl = (url: string) => /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/.test(url);
        if (mode === "create") {
            if (create.name.trim() === "" || create.url.trim() === "") return false;
            if (!isValidUrl(create.url)) return false;
        }
        return true;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => { setSelectedList(null) }} />
                <h2 className="text-2xl font-semibold">{mode === "edit" ? "Edit" : "New"} Item</h2>
            </div>
            <div className="flex-1">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col text-left gap-3">
                        <label className="mb-1 text-sm font-medium text-gray-200">Display Name</label>
                        <input
                            type="text"
                            value={data ? data[keyName][index!]?.name : ""}
                            onChange={(e) => {
                                const newList = [...(qc.getQueryData<any>(["data"])?.[keyName] || [])];
                                newList[index!] = { ...newList[index!], name: e.target.value };
                                qc.setQueryData(["data"], { ...qc.getQueryData(["data"]), [keyName]: newList });
                                if (mode === "create") setCreate({ ...create, name: e.target.value });
                            }}
                            className="w-full p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none"
                        />

                        <label className="mb-1 text-sm font-medium text-gray-200">URL</label>
                        <div className="flex items-center">
                            <span className="px-2 py-2 rounded-l-lg bg-[#222] border border-r-0 border-[#333] text-gray-400 select-none">
                                https://
                            </span>
                            <input
                                type="text"
                                value={
                                    mode === "create"
                                        ? create.url.replace(/^https?:\/\//, "")
                                        : (data ? data[keyName][index!]?.url.replace(/^https?:\/\//, "") : "")
                                }
                                onChange={(e) => {
                                    const urlValue = "https://" + e.target.value.replace(/^https?:\/\//, "");
                                    if (mode === "create") {
                                        setCreate({ ...create, url: urlValue });
                                    } else {
                                        const newList = [...(qc.getQueryData<any>(["data"])?.[keyName] || [])];
                                        newList[index!] = { ...newList[index!], url: urlValue };
                                        qc.setQueryData(["data"], { ...qc.getQueryData(["data"]), [keyName]: newList });
                                    }
                                }}
                                required
                                className="w-full p-2 rounded-r-lg bg-[#333] border border-[#333] focus:outline-none"
                                placeholder="your-site.com"
                            />
                        </div>
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