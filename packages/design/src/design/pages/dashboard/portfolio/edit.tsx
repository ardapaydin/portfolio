import EditSidebar from "@/design/components/dashboard/template/editSidebar";
import Topbar from "@/design/components/dashboard/template/topbar";
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
        <div className="flex flex-col md:flex-row flex-1 h-screen">
            <EditSidebar />
            <div className="flex flex-col flex-1 min-h-0 p-4">
                <Topbar />
                <div className="flex-1 flex rounded-b-lg justify-center items-center overflow-auto relative">
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
                </div>
            </div>
        </div>
    )
}