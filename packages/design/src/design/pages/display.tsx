import TemplateWai from "../../templates/wai/main";
import { useTemplate } from "../../utils/api/queries";

export default function DisplayTemplate() {
    const { template } = Object.fromEntries(new URLSearchParams(window.location.search));
    const r = useTemplate(template);
    switch (template) {
        case "wai": return <TemplateWai d={r.data?.default} />
        default: return <div className="text-center text-white mt-20">Template not found</div>
    }
}