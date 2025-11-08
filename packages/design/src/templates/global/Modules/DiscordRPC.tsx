import GetUser from "@/utils/api/discord";
import { getPortfolioModule } from "@/utils/api/queries";
import { useParams } from "react-router-dom";
const presence = new Map([
    ["invisible", "gray"],
    ["dnd", "red"],
    ["idle", "yellow"],
    ["online", "green"]
])
export default function DiscordRPC({ data }: { data: Record<string, any> }) {
    const subdomain = process.env.NODE_ENV === "production"
        ? window.location.hostname.split('.')[0]
        : window.location.pathname.match(/\/view\/([^/]+)/)?.[1]!;

    const { id } = useParams();

    const module = getPortfolioModule(id || subdomain, 4);
    const d = GetUser(module.data?.id);

    const user = d.data?.data.data;

    if (!user) return

    const { discord_user, discord_status, listening_to_spotify, spotify, activities } = user;

    return (
        <div className="p-4 mt-4 rounded-lg shadow w-full" style={{ backgroundColor: data.boxColor }}>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`}
                        className="w-16 h-16 rounded-full"
                    />
                    <div className={`w-4 h-4 bg-${presence.get(discord_status)}-5   00 bottom-0 absolute right-0 rounded-full`} />
                </div>
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{discord_user.global_name}</h2>
                    <h2 className="text-sm text-muted-foreground font-bold">{discord_user.username}</h2>
                </div>
            </div>

            {listening_to_spotify && spotify && (
                <div className="mt-4 p-4 bg-green-900 rounded-lg">
                    <h3 className="text-lg font-semibold">Listening to Spotify</h3>
                    <div className="flex items-center space-x-4 mt-2">
                        <img
                            src={spotify.album_art_url}
                            className="w-16 h-16 rounded-lg"
                        />
                        <div>
                            <p className="font-bold">{spotify.song}</p>
                            <p className="text-sm text-gray-300">{spotify.artist}</p>
                            <p className="text-sm text-gray-400">{spotify.album}</p>
                        </div>
                    </div>
                </div>
            )}

            {activities && activities.length > 0 && (
                <div className="mt-4">
                    <div className="space-y-2 mt-2">
                        {activities.map((activity: { name: string, details?: string, state?: string }, index: number) => (
                            <div key={index} className="p-2 rounded-lg bg-[#444]">
                                <p className="font-bold">{activity.name}</p>
                                {activity.details && <p className="text-sm text-gray-300">{activity.details}</p>}
                                {activity.state && <p className="text-sm text-gray-400">{activity.state}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}