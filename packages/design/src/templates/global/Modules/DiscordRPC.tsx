import GetUser from "@/utils/api/discord";
import { getPortfolioModule } from "@/utils/api/queries";
import { useParams } from "react-router-dom";

export default function DiscordRPC({ data }: { data: Record<string, any> }) {
    const subdomain = process.env.NODE_ENV === "production"
        ? window.location.hostname.split('.')[0]
        : window.location.pathname.match(/\/view\/([^/]+)/)?.[1]!;

    const { id } = useParams()

    const module = getPortfolioModule(id || subdomain, 4);
    const d = GetUser(module.data?.id)

    return (
        <div>
            {JSON.stringify(d.data)}
        </div>
    )
}