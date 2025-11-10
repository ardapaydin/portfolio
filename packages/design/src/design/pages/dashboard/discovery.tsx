import ViewPortfolio from "@/design/components/dashboard/dialogs/Discovery/View";
import Layout from "@/design/components/dashboard/layout";
import { LoadingSmall } from "@/design/components/loading";
import UserAvatar from "@/design/components/user/avatar";
import { useDiscovery } from "@/utils/api/queries";
import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Discovery() {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const portoflios = useDiscovery(query, page, 10);
    useEffect(() => { setPage(1) }, [query])

    return (
        <Layout>
            <div className="flex flex-col">
                <div className="items-center justify-between flex">
                    <h1 className="font-bold text-xl">Discovery</h1>
                    <div className="flex">
                        <div className="p-2 rounded-l-lg bg-[#333] border-r-0 border-[#262626] border-4 ">
                            <Search />
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="p-2 rounded-r-lg bg-[#333] border-l-0 border-[#262626] border-4 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {portoflios.isLoading && <LoadingSmall /> || (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
                    {portoflios.data?.data?.map((portfolio) => (
                        <div className="bg-[#222222] rounded-md  flex flex-col border shadow-lg border-[#303030]">
                            <div className="flex flex-col p-8">
                                <h1 className="font-bold">{portfolio.name}</h1>
                                <p className="text-muted text-sm">
                                    Template: {portfolio.template}
                                </p>

                                <hr className="border-[#303030] mt-2 mb-4" />

                                <div className="flex gap-2 justify-between items-center">
                                    <div className="flex gap-2 items-center text-sm">
                                        <UserAvatar userData={portfolio.createdBy} className="w-8 h-8" />
                                        <span>{portfolio.createdBy.name}</span>
                                    </div>

                                    <ViewPortfolio portfolio={portfolio}>
                                        <button
                                            className="py-0.5 flex items-center gap-1 px-2 rounded-lg bg-green-500 border-b-8 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                                            View
                                        </button>
                                    </ViewPortfolio>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    )
}