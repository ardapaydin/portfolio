import type { TypePortfolio } from "@/design/types/portfolio";
import type { TypeUser } from "@/design/types/user";

export default function Browser({ portfolio }: {
    portfolio: (TypePortfolio & { createdBy: TypeUser, url: string })
}) {
    return (
        <div className="flex w-full h-full flex-1 flex-col">
            <div className="flex items-center h-12 justify-between bg-[#0e0d0d] border-b border-black px-6 shadow-sm">
                <div className="md:flex space-x-2 mr-6 hidden">
                    <span className="w-3 h-3 rounded-full bg-red-500 shadow-md" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-md" />
                    <span className="w-3 h-3 rounded-full bg-green-500 shadow-md" />
                </div>

                <div className="bg-[#333] px-2 rounded-lg">
                    {portfolio.url}
                </div>

                <div></div>
            </div>
            <iframe src={portfolio.url} className="h-full w-full" />
        </div>

    )
}