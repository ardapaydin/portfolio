import EditSidebar from "@/design/components/dashboard/template/editSidebar";
import Error from "@/design/components/error";
import Loading from "@/design/components/loading";
import TemplateWai from "@/templates/wai/main";
import { usePortfolio, useTemplate } from "@/utils/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

export default function EditPortfolio() {
    const { id } = useParams();
    const { data: portfolio, isLoading } = usePortfolio(id!);
    const template = useTemplate(portfolio?.template!);
    const qc = useQueryClient();
    if (isLoading || template.isLoading) return <Loading />;
    if (!portfolio?.name) return <Navigate to="/dashboard" replace />;
    qc.setQueryData(["data"], portfolio?.data);
    return (
        <div className="flex flex-1 h-screen">
            <EditSidebar />
            <div className="flex flex-col flex-1 min-h-0 p-4">
                <div className="flex items-center h-12 rounded-lg mb-2 bg-black/50 border-b border-black px-6 shadow-sm">
                    <div className="flex space-x-2 mr-6">
                        <span className="w-3 h-3 rounded-full bg-red-500 shadow-md"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-md"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500 shadow-md"></span>
                    </div>
                    <div className="flex-1 text-center">
                        <span className="text-base font-semibold text-gray-100 truncate">
                            {portfolio?.name}
                        </span>
                    </div>
                </div>
                <main className="flex-1 flex rounded-lg justify-center items-center overflow-auto relative">
                    <div className="shadow-2xl relative w-full my-2 overflow-auto">
                        {template.data ? (() => {
                            switch (portfolio?.template) {
                                case "wai":
                                    return <TemplateWai />;
                                default:
                                    return <Error />;
                            }
                        })() : null}
                    </div>
                </main>
            </div>
        </div>
    )
}