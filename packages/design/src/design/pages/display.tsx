import TemplateWai from "../../templates/wai/main";
import { useTemplate } from "../../utils/api/queries";

export default function DisplayTemplate() {
    const { template } = Object.fromEntries(new URLSearchParams(window.location.search));
    useTemplate(template);
    switch (template) {
        case "wai": return <TemplateWai />
        default: return <div className="text-center text-white mt-20">Template not found</div>
    }
}