import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { GetPortfolioAnalytics } from "@/utils/api/queries";
import { useState } from "react"
import { useParams } from "react-router-dom";
import { LoadingSmall } from "../../loading";
const formatDate = (date: Date) =>
    date.toISOString().slice(0, 10);
import { CartesianGrid, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Analytics({ children }: {
    children: React.ReactNode
}) {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [range] = useState({
        from: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        to: formatDate(new Date())
    });

    const analytics = GetPortfolioAnalytics(id!, range.from.toString(), range.to.toString(), isOpen);

    const getPercentageChange = (current: number, previous: number) => {
        if (previous === 0) return current === 0 ? 0 : 100;
        return ((current - previous) / Math.abs(previous)) * 100;
    };

    const formatdata = () => {
        return analytics.data?.daily.map((item) => ({
            date: new Date(item.date).toLocaleDateString(),
            Unique: item.unique,
            View: item.views
        }))
    };

    const percentChange = (() => {
        const data = analytics.data?.daily;
        if (!data || data.length < 2) return null;
        const prev = data[data.length - 2];
        const curr = data[data.length - 1];
        return {
            unique: getPercentageChange(curr.unique, prev.unique),
            view: getPercentageChange(curr.views, prev.views)
        };
    })();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="md:max-w-2xl mx-auto rounded-xl shadow-xl p-8 text-center">
                {(analytics.isLoading) && (
                    <div className="flex flex-col gap-2 m-12">
                        <LoadingSmall />
                    </div>
                )}
                {(analytics.data && !analytics.isLoading) && (
                    <div className="h-96 w-full flex flex-col">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span className="bg-[#18181b] px-2 py-1 rounded font-mono">{range.from}</span>
                            <span className="text-white font-bold">to</span>
                            <span className="bg-[#18181b] px-2 py-1 rounded font-mono">{range.to}</span>
                        </div>

                        <div className="flex gap-2 mb-2">
                            <div className="bg-[#222222] rounded-md p-2 px-4 items-start flex flex-col border shadow-lg border-[#303030]">
                                <h1>Unique Views</h1>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold">
                                        {analytics.data.daily.reduce((sum, item) => sum + item.unique, 0)}
                                    </span>
                                    {percentChange && (
                                        <span
                                            className={`ml-2 flex items-center text-xs font-semibold ${percentChange.unique > 0
                                                ? "text-green-500"
                                                : percentChange.unique < 0
                                                    ? "text-red-500"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            {percentChange.unique > 0 && "+"}
                                            {percentChange.unique?.toFixed(1)}%
                                            {percentChange.unique > 0 && (
                                                <ArrowUpRight />
                                            )}
                                            {percentChange.unique < 0 && (
                                                <ArrowDownRight />
                                            )}

                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-[#222222] rounded-md p-2 px-4 flex items-start flex-col border shadow-lg border-[#303030]">
                                <h1>Total Views</h1>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold">
                                        {analytics.data.daily.reduce((sum, item) => sum + item.views, 0)}
                                    </span>
                                    {percentChange && (
                                        <span
                                            className={`ml-2 flex items-center text-xs font-semibold ${percentChange.view > 0
                                                ? "text-green-500"
                                                : percentChange.view < 0
                                                    ? "text-red-500"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            {percentChange.view > 0 && "+"}
                                            {percentChange.view?.toFixed(1)}%
                                            {percentChange.view > 0 && (
                                                <ArrowUpRight />
                                            )}
                                            {percentChange.view < 0 && (
                                                <ArrowDownRight />
                                            )}

                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer className={"-mx-4"} width={"100%"} height={"100%"}>
                            <LineChart data={formatdata() || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888"
                                    tick={{ fill: "#888" }}
                                    tickMargin={10}
                                />
                                <YAxis stroke="#888" tick={{ fill: "#888" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#2a2a2c",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "#fff"
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                    labelStyle={{ color: "#ddd", fontWeight: "bold", marginBottom: "5px" }}
                                />
                                <Legend wrapperStyle={{ color: "#fff", padding: "10px 0" }} />
                                <Line
                                    type="monotone"
                                    dataKey="Unique"
                                    stroke="#3B82F6"
                                    activeDot={{ r: 8, fill: "#3B82F6" }}
                                    strokeWidth={2}
                                    dot={{ stroke: "#3B82F6", strokeWidth: 2, r: 4, fill: "#1E293B" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="View"
                                    stroke="#F59E42"
                                    strokeWidth={2}
                                    dot={{ stroke: "#F59E42", strokeWidth: 2, r: 4, fill: "#1E293B" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}