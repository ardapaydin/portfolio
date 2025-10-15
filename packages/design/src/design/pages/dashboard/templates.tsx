import { useTemplates } from "../../../utils/api/queries";
import Layout from "../../components/dashboard/layout";
import TemplateBox from "../../components/dashboard/template/box";
import Error from "../../components/error";
import { LoadingSmall } from "../../components/loading";
import type { TypeTemplate } from "../../types/template";

export default function Templates() {
    const templates = useTemplates();
    return (
        <Layout>
            <div className="flex-1 h-full">
                <h1 className="text-2xl font-bold mb-4">Templates</h1>
                {templates.isLoading ? (<LoadingSmall />) : templates.error ? (
                    <Error />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(templates.data as unknown as { templates: TypeTemplate[] })?.templates.map((template: TypeTemplate) => <TemplateBox key={template.id} template={template} />)}
                    </div>
                )}
            </div>
        </Layout>
    )
}