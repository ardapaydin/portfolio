import { Eye } from "lucide-react";
import type { TypeTemplate } from "../../../types/template";
import CreatePortfolio from "../dialogs/CreatePortfolio";

export default function TemplateBox({ template }: { template: TypeTemplate }) {
    return (
        <div className="flex flex-col bg-[#222222] rounded-lg border-2 border-[#252525] shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-64 w-full">
                <img src={`/templates/${template.id}.png`} draggable={false} className="w-full h-64 rounded-t-lg object-cover mb-4" />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:bg-black/70 transition" onClick={() => {
                    window.open("/template?template=" + template.id, "_blank")
                }}>
                    <Eye className="w-4" />
                    Preview
                </div>
            </div>
            <div className="flex-1 p-4">
                <h2 className="text-xl font-bold mb-2">{template.name}</h2>
                <p className="text-gray-300">{template.description}</p>
                <hr className="my-4 border-[#282828]" />
                <div className="justify-between flex items-end">
                    <span className="text-sm text-gray-400">
                        Fields: {template.fieldSize}
                    </span>
                    <CreatePortfolio templateId={template.id}>
                        <button
                            className="py-0.5 px-2 rounded-lg bg-green-500 border-b-8 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                        >
                            Use Template
                        </button>
                    </CreatePortfolio>
                </div>
            </div>
        </div>
    )
}