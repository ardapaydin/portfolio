import type { TypeTemplate } from "@/design/types/template";
import { usePortfolio, useTemplate } from "@/utils/api/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ListSidebar from "./list";

export default function EditSidebar() {
    const { id } = useParams();
    const [selectedList, setSelectedList] = useState(null as { key: string, mode: "edit" | "create", index?: number, value?: { name: string, url: string } } | null);
    const portfolio = usePortfolio(id!);
    const template = useTemplate(portfolio?.data?.template!) as { data: TypeTemplate | undefined, isLoading: boolean };
    const qc = useQueryClient();
    if (portfolio.isLoading || template.isLoading || !template.data) return;
    const updateField = (fieldId: string, value: any) => {
        const newData = { ...qc.getQueryData<any>(["data"]), [fieldId]: value };
        qc.setQueryData(["data"], newData);
        console.log(newData);
    }
    const data = useQuery({
        queryKey: ["data"],
        queryFn: async () => ({} as TypeTemplate),
    }).data as TypeTemplate | undefined;
    const keys = Object.keys(template.data.fields).filter((key) => template.data?.fields[key].type != "image");
    return (
        <div className="p-4">
            <div className="w-96 h-full bg-black/20 px-8 py-8 rounded-lg shadow-lg overflow-y-auto">
                {selectedList && <ListSidebar keyName={selectedList.key} mode={selectedList.mode} value={selectedList.value} index={selectedList.index} setSelectedList={setSelectedList} />}
                {!selectedList && (
                    <>
                        {Object.values(template.data.fields)
                            .filter((field) => field.type != "image")
                            .map((field, i) => (
                                <div key={field.label} className="mb-4">
                                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                                    {field.type === "text" && (
                                        <textarea
                                            className="w-full p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none"
                                            rows={4}
                                            onChange={(e) => updateField(keys[i], e.target.value)}
                                            value={data ? data[keys[i]] : ""}
                                        />
                                    )}
                                    {field.type === "string" && (
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none"
                                            onChange={(e) => updateField(keys[i], e.target.value)}
                                            value={data ? data[keys[i]] : ""}
                                        />
                                    )}

                                    {field.type === "list" && (
                                        <div className="flex flex-col gap-2">
                                            {data?.[keys[i]].map((item: { name: string, url: string }, index: number) => (
                                                <div
                                                    onClick={() => setSelectedList({ key: keys[i], index, mode: "edit", value: item })}
                                                    key={index} className="flex w-full items-center justify-between px-3 gap-2 bg-[#333]/50 p-2 rounded-md hover:bg-[#333]/70 transition cursor-pointer">
                                                    {item.name}
                                                    <ArrowRight className="w-4 mt-1" />
                                                </div>
                                            ))}

                                            <div
                                                className="flex w-full items-center justify-center px-3 gap-2 bg-[#333]/20 p-2 rounded-md hover:bg-[#333]/40 transition cursor-pointer"
                                                onClick={() => { setSelectedList({ key: keys[i], mode: "create" }) }}
                                            >
                                                Add New Item
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </>
                )}

            </div>
        </div>
    )
}