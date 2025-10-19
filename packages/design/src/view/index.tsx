import Loading from "@/design/components/loading";
import TemplateWai from "@/templates/wai/main";
import { getSubdomain } from "@/utils/api/subdomain";
import { type UseQueryResult } from "@tanstack/react-query"
import { FileWarning } from "lucide-react";

export default function View() {
    const subdomain = process.env.NODE_ENV == "production" ? window.location.hostname.split('.')[0] : window.location.pathname.split("/view/")?.[1]
    const data = getSubdomain(subdomain) as UseQueryResult & { data: { message: string, template: string, data: unknown } };
    if (data.isLoading) return <Loading />
    if (data.data?.message as string) return (
        <div className="h-screen px-2 text-center w-screen flex flex-col justify-center border-2 border-dashed border-muted-foreground/50 rounded items-center">
            <FileWarning className="w-15 h-15 mb-2 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-2">Portfolio Not Found</h1>
            <p className="text-muted-foreground text-lg">
                The requested portfolio does not exist or is not published yet.
            </p>
        </div>
    )
    switch (data.data.template) {
        case "wai": return <TemplateWai d={data.data.data} />
    }
}