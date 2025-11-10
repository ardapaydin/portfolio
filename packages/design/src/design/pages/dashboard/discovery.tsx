import Layout from "@/design/components/dashboard/layout";
import { LoadingSmall } from "@/design/components/loading";
import { useDiscovery } from "@/utils/api/queries";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Discovery() {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const portoflios = useDiscovery(query, page, 10);
    const [x, setX] = useState(null)
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
                        <div>{portfolio.name}</div>
                    ))}
                </div>
            )}
        </Layout>
    )
}