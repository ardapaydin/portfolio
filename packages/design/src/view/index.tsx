import Blog from "@/blog/main";
import Loading from "@/design/components/loading";
import TemplateCamba from "@/templates/camba/main";
import TemplateEon from "@/templates/eon/main";
import TemplateWai from "@/templates/wai/main";
import { getSubdomain } from "@/utils/api/subdomain";
import { type UseQueryResult } from "@tanstack/react-query"
import { FileWarning } from "lucide-react";
import { useEffect } from "react";

export default function View() {
    const subdomain = process.env.NODE_ENV === "production"
        ? window.location.hostname.split('.')[0]
        : window.location.pathname.match(/\/view\/([^/]+)/)?.[1]!;
    const data = getSubdomain(subdomain!) as UseQueryResult & { data: { message: string, template: string, data: unknown } };
    const isblog = (process.env.NODE_ENV == "production" ? window.location.pathname.split("/")[1] : window.location.pathname.split("/")?.[3]) == "blog";
    useEffect(() => {
        if (!data.data) return;
        const createws = new WebSocket(`${import.meta.env.VITE_API_BASE_URL || "/api"}/portfolios/ws/${subdomain}`);
        const sendHeartbeat = () => {
            if (createws.readyState === WebSocket.OPEN) createws.send(JSON.stringify({ type: "heartbeat" }));
        };
        const message = (ev: MessageEvent) => {
            const parse = JSON.parse(ev.data);
            switch (parse.type) {
                case "welcome": {
                    sendHeartbeat();
                    break;
                }
            }
        }
        createws.addEventListener("message", message);
        const interval = setInterval(sendHeartbeat, 25000);
        return () => {
            clearInterval(interval);
            createws.removeEventListener("message", message);
            createws.close();
        };
    }, [data.data])
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
    if (isblog) return <Blog />
    switch (data.data.template) {
        case "wai": return <TemplateWai d={data.data.data} />
        case "camba": return <TemplateCamba d={data.data.data} />
        case "eon": return <TemplateEon d={data.data.data} />
    }
}