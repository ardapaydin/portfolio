import { usePortfolios } from "@/utils/api/queries"
import { Pencil, Projector, Settings, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UpdatePortfolio from "./dialogs/Portfolio/UpdatePortfolio";
import DeletePortfolio from "./dialogs/Portfolio/DeletePortfolio";

export default function Portfolios() {
    const portfolios = usePortfolios();
    const nav = useNavigate();
    return (
        <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
                {portfolios.data?.map((portfolio) => (
                    <div className="bg-[#222222] rounded-md flex flex-col border shadow-lg border-[#303030]">
                        <div className="flex flex-col p-8">
                            <div className="flex justify-between items-center">
                                <h1 className="font-bold">
                                    {portfolio.name}
                                </h1>
                                <div className="flex">
                                    {portfolio.isPublished && (
                                        <div className="bg-green-500/10 border border-green-500/50 px-2 py-0.5 rounded-lg">
                                            Published
                                        </div>
                                    ) || (
                                            <div className="bg-gray-500/10 border border-gray-500/50 px-2 py-0.5 rounded-lg">
                                                Draft
                                            </div>
                                        )}
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm">
                                Template: {portfolio.template}
                            </p>
                        </div>

                        <hr className="border-[#303030] mt-2" />

                        <div className="flex gap-2 justify-between items-center px-8 pb-6 pt-4">
                            <button
                                onClick={() => {
                                    nav(`/dashboard/portfolio/${portfolio.id}/edit`)
                                }}
                                className="py-0.5 flex items-center gap-1 px-2 rounded-lg bg-green-500 border-b-8 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                            >
                                Edit <Pencil className="w-4" />
                            </button>

                            <div className="flex items-center gap-2">
                                <UpdatePortfolio portfolioId={portfolio.id}>
                                    <Settings className="w-5 cursor-pointer text-muted-foreground hover:text-white transition" />
                                </UpdatePortfolio>
                                <DeletePortfolio id={portfolio.id}>
                                    <Trash className="w-5 cursor-pointer text-red-500/50 hover:text-red-500 transition" />
                                </DeletePortfolio>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
            {!portfolios.data?.length && (
                <div className="bg-[#333]/50 w-full py-12 flex-col border-[#333] border-dashed border-2 flex rounded-lg justify-center items-center p-6">
                    <Projector className="inline-block w-16 h-16 mr-2 mb-1 text-yellow-300" />
                    <h1 className="text-2xl font-semibold">No Portfolios Found</h1>
                    <p className="text-muted-foreground">
                        Select a template from the Templates page to create a portfolio
                    </p>
                    <button
                        onClick={() => nav("templates")}
                        className="mt-4 py-2  disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"                    >
                        Select Template
                    </button>
                </div>
            )}

        </>
    )
}