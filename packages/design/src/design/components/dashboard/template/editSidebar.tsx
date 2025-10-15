import { usePortfolio, useTemplate } from "@/utils/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function EditSidebar() {
    const { id } = useParams();
    const portfolio = usePortfolio(id!);
    const template = useTemplate(portfolio?.data?.template!);
    const qc = useQueryClient();
    if (portfolio.isLoading || template.isLoading) return;
    const updateField = (fieldId: string, value: any) => {
        const newData = { ...qc.getQueryData<any>(["data"]), [fieldId]: value };
        qc.setQueryData(["data"], newData);
        console.log(newData);
    }
    const keys = Object.keys(template.data.fields).filter((key) => template.data.fields[key].type != "image");
    return (
        <div className="p-4">
            <div className="w-96 h-full bg-black/20 px-8 py-8 rounded-lg shadow-lg">
                {Object.values(template.data.fields)
                    .filter((field: any) => field.type != "image")
                    .map((field: any, i) => (
                        <div key={field.id} className="mb-4">
                            <label className="block text-sm font-medium mb-1">{field.label}</label>
                            {field.type === "text" && (
                                <textarea
                                    className="w-full p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none"
                                    rows={4}
                                    onChange={(e) => updateField(keys[i], e.target.value)}
                                />
                            )}
                            {field.type === "string" && (
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none"
                                    onChange={(e) => updateField(keys[i], e.target.value)}
                                />
                            )}


                        </div>
                    ))}
            </div>
        </div>
    )
}