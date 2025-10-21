import { GetPortfolioEventAnalytics } from "@/utils/api/queries";
import { useState } from "react"
import { useParams } from "react-router-dom";
import { LoadingSmall } from "../../../loading";
const formatDate = (date: Date) =>
    date.toISOString().slice(0, 10);

export default function EngagementMetrics({ isOpen }: { isOpen: boolean }) {
    const { id } = useParams();
    const [range] = useState({
        from: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        to: formatDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000))
    });

    const analytics = GetPortfolioEventAnalytics(id!, "clickLink", range.from.toString(), range.to.toString(), isOpen);
    return (
        <>
            {analytics.isLoading && (
                <div className="flex flex-col gap-2 m-12">
                    <LoadingSmall />
                </div>
            )}
            {analytics.data && !analytics.isLoading && (
                <div className="w-full flex flex-col">
                    <div className="justify-between flex items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <span className="bg-[#18181b] px-2 py-1 rounded font-mono">{range.from}</span>
                            <span className="text-white font-bold">to</span>
                            <span className="bg-[#18181b] px-2 py-1 rounded font-mono">{range.to}</span>
                        </div>
                        <h2 className="font-semibold">Top Clicked Links</h2>
                    </div>
                    <div className="overflow-auto rounded-lg border border-[#222222] bg-[#333333]">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-[#222222] text-zinc-300">
                                    <th className="px-4 py-2 text-left font-medium">#</th>
                                    <th className="px-4 py-2 text-left font-medium">Name</th>
                                    <th className="px-4 py-2 text-left font-medium">URL</th>
                                    <th className="px-4 py-2 text-right font-medium">Clicks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-zinc-400">
                                            No link clicks in this range.
                                        </td>
                                    </tr>
                                )}
                                {analytics.data.map((x, i) => (
                                    <tr key={x.key} className="border-t border-[#252525] transition text-start [&_td]:px-4 [&_td]:py-2">
                                        <td >{i + 1}</td>
                                        <td className="font-medium">{x.name}</td>
                                        <td>
                                            <a
                                                href={x.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 underline break-all"
                                            >
                                                {x.url}
                                            </a>
                                        </td>
                                        <td className="text-right font-mono">{x.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}