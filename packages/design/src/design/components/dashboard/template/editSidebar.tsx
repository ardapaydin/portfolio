import type { TypeTemplate } from "@/design/types/template";
import { useModules, usePortfolio, usePortfolioDraft, useTemplate } from "@/utils/api/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Puzzle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListSidebar from "./list";
import { SaveToDraft } from "@/utils/api/portfolio";
import Modules from "../dialogs/Modules/Modules";

export default function EditSidebar() {
    const { id } = useParams();
    const [selectedList, setSelectedList] = useState(null as { key: string, mode: "edit" | "create", index?: number, value?: { name: string, url: string } } | null);
    const portfolio = usePortfolio(id!);
    const template = useTemplate(portfolio?.data?.template!) as { data: TypeTemplate | undefined, isLoading: boolean };
    const modules = useModules(portfolio?.data?.template);
    const qc = useQueryClient();
    const draft = usePortfolioDraft(id!);
    const updateField = (fieldId: string, value: any) => {
        const newData = { ...qc.getQueryData<any>(["data"]), [fieldId]: value };
        qc.setQueryData(["data"], newData);
    }
    useEffect(() => {
        if ((draft.data?.createdAt || "") > portfolio.data?.updatedAt && draft.data?.data) qc.setQueryData(["data"], draft.data.data);
    }, [draft.data, portfolio.data?.updatedAt]);

    const data = useQuery({
        queryKey: ["data"],
        queryFn: async () => ({} as TypeTemplate),
    }).data as TypeTemplate | undefined;

    useEffect(() => {
        if (JSON.stringify(draft.data?.data) === JSON.stringify(data)) return;
        window.onbeforeunload = () => true;
        const timeout = setTimeout(async () => {
            qc.setQueryData(["portfolio", id, "draft"], { ...draft.data, data, updating: true });
            await SaveToDraft(id!, data);
            qc.setQueryData(["portfolio", id, "draft"], { ...draft.data, data, updatedAt: new Date().toISOString(), updating: false });
            window.onbeforeunload = null;
        }, 1000);
        return () => {
            window.onbeforeunload = null;
            clearTimeout(timeout)
        };
    }, [data, draft.data?.data]);
    if (portfolio.isLoading || template.isLoading || !template.data || draft.isLoading) return;

    const keys = Object.keys(template.data.fields).filter((key) => template.data?.fields[key].type != "image");
    return (
        <div className="p-4">
            <div className="w-96 h-full border-[#262626] border-2 bg-[#222222] px-8 py-8 rounded-lg shadow-lg overflow-y-auto">
                {selectedList && <ListSidebar keyName={selectedList.key} mode={selectedList.mode} index={selectedList.index} setSelectedList={setSelectedList} />}
                {!selectedList && (
                    <>
                        {Object.values(template.data.fields)
                            .filter((field) => field.type != "image")
                            .map((field, i) => (
                                <div key={field.label} className="mb-4">
                                    <div className="flex items-center gap-1 mb-1">
                                        <label className="block text-sm font-medium">{field.label}</label>
                                        {field.markdown && <span className="text-xs bg-gray-600/25 text-white/30 px-1 rounded">Markdown Supported</span>}
                                    </div>
                                    {field.type === "text" && (
                                        <textarea
                                            className="w-full p-2 rounded-lg bg-[#333] border-[#262626] border-4 focus:outline-none"
                                            rows={4}
                                            onChange={(e) => updateField(keys[i], e.target.value)}
                                            value={data ? data[keys[i]] : ""}
                                        />
                                    )}
                                    {field.type === "string" && (
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded-lg bg-[#333] border-[#262626] border-4 focus:outline-none"
                                            onChange={(e) => updateField(keys[i], e.target.value)}
                                            value={data ? data[keys[i]] : ""}
                                        />
                                    )}

                                    {field.type === "list" && (
                                        <div className="flex flex-col gap-2">
                                            {data?.[keys[i]].map((item: { name: string, url: string }, index: number) => (
                                                <div
                                                    onClick={() => setSelectedList({ key: keys[i], index, mode: "edit", value: item })}
                                                    key={index} className="flex w-full items-center justify-between px-3 gap-2 bg-[#333]/50 p-2 rounded-md border-[#262626] border-2 hover:bg-[#333]/70 transition cursor-pointer">
                                                    <p className="truncate">{item.name}</p>
                                                    <ArrowRight className="w-4 min-w-4 mt-1" />
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

                                    {field.type === "color" && (
                                        <div className="flex items-center gap-2 relative">
                                            <div
                                                className="min-w-8 h-8 rounded-lg border-[#262626] border-2 cursor-pointer"
                                                style={{ backgroundColor: data ? data[keys[i]] : "#000000" }}
                                                onClick={() => {
                                                    const input = document.getElementById(`color-input-${keys[i]}`) as HTMLInputElement | null;
                                                    input?.click();
                                                }}
                                            ></div>
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 rounded-lg bg-[#333] border-[#262626] border-4 focus:outline-none"
                                                value={data ? data[keys[i]] : "#000000"}
                                                onChange={(e) => updateField(keys[i], e.target.value)}
                                            />
                                            <input
                                                id={`color-input-${keys[i]}`}
                                                type="color"
                                                className="w-0 h-0 p-0 opacity-0 absolute"
                                                style={{ pointerEvents: "none" }}
                                                tabIndex={-1}
                                                onChange={(e) => updateField(keys[i], e.target.value)}
                                                value={data ? data[keys[i]] : "#000000"}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </>
                )}
                {(modules.data?.length) && (
                    <>
                        <hr className="border-[#333]" />
                        <Modules>
                            <div className="flex items-center gap-2.5 cursor-pointer bg-[#333]/80 hover:bg-[#333] border-[#262626] border-2 p-3 rounded-lg transition-all duration-200 mt-6">
                                <Puzzle className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-gray-300">Modules</span>
                            </div>
                        </Modules>
                    </>
                ) || null}
            </div>
        </div>
    )
}