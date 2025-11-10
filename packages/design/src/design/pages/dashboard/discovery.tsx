import ViewPortfolio from "@/design/components/dashboard/dialogs/Discovery/View";
import Layout from "@/design/components/dashboard/layout";
import { LoadingSmall } from "@/design/components/loading";
import UserAvatar from "@/design/components/user/avatar";
import { useDiscovery } from "@/utils/api/queries";
import { Eye, FileWarning, Search } from "lucide-react";
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
                <>
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

                    {(!portoflios.data?.data.length && !query) && (
                        <div className="flex flex-col mt-4 mb-2 justify-center items-center">
                            <FileWarning className="w-15 h-15 mb-2 text-muted-foreground" />
                            <h1 className="text-3xl font-bold mb-2">
                                No Portfolios Published to Discovery yet
                            </h1>
                        </div>
                    )}

                    {(query && !portoflios.data?.data.length) && (
                        <div className="flex flex-col mt-4 mb-2 justify-center items-center">
                            <Search className="w-15 h-15 mb-2 text-muted-foreground" />
                            <h1 className="text-3xl font-bold mb-2">
                                No portfolios match your search. Try refining your query.
                            </h1>
                        </div>
                    )}

                    <div className="flex justify-center items-center gap-4 mt-10">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="px-4 py-2 rounded border border-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333] disabled:hover:bg-transparent"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-muted-foreground">
                            Page {String(portoflios.data?.pagination.page)} of {String(portoflios.data?.pagination.totalPages)}
                        </span>

                        <button
                            disabled={page >= portoflios.data?.pagination.totalPages!}
                            onClick={() => setPage((p) => Math.min(portoflios.data?.pagination.totalPages!, p + 1))}
                            className="px-4 py-2 rounded border border-[#333] disabled:opacity-50 disabled:cursor-pointer disabled:hover:bg-transparent hover:bg-[#333]">
                            Next
                        </button>
                    </div>
                </>
            )}


        </Layout>
    )
}