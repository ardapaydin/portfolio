import CustomLink from "@/templates/global/Link";
import { getGitlabProjects } from "@/utils/api/gitlab";
import { getPortfolioModule } from "@/utils/api/queries";
import { Star } from "lucide-react";
import { useParams } from "react-router-dom"

export default function EonGitLabProjects({ data }: { data: Record<string, any> }) {
    const subdomain = process.env.NODE_ENV == "production" ? window.location.hostname.split('.')[0] : window.location.pathname.split("/view/")?.[1]
    const { id } = useParams();

    const module = getPortfolioModule(id || subdomain, 3);
    const d = getGitlabProjects(module?.data?.slug, module.data?.config?.sort, module.data?.config?.max)
    return (
        <div id="gitlab-projects" className="flex flex-col my-8 px-2 md:px-0 max-w-7xl mx-auto w-full">
            <div className="uppercase text-sm tracking-widest text-white/50 mb-4" style={{
                letterSpacing: "0.3rem"
            }}>
                GitLab
            </div>


            <div className="relative break-words mb-2">
                <span className="relative break-words text-5xl font-bold">
                    GitLab Projects
                    <span className="absolute left-0 bottom-0 w-[calc(100%+4rem)] h-7 -z-1" style={{ backgroundColor: data.underlineColor }} />
                </span>
            </div>

            <ul className="w-full flex flex-col gap-8">
                {d.isLoading && (
                    <>
                        {Array.from({ length: 5 })
                            .map((_x, idx) => (
                                <div className={`flex w-full justify-${idx % 2 == 0 ? "start" : "end"}`}>
                                    <li key={idx} style={{ backgroundColor: data.boxColor }} className={`animate-pulse md:w-1/2 rounded-lg shadow-lg p-8 flex flex-col md:flex-row${idx % 2 == 0 ? "-reverse" : ""} gap-6`}>
                                        <div className="flex flex-col items-center md:items-start md:w-1/4">
                                            <div className="flex items-center mb-2">
                                                <span className="text-2xl font-bold">
                                                    <div className="animate-pulse h-2 w-32 rounded-lg flex bg-[#333]" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-white text-base break-words">
                                            <div className="animate-pulse h-2 w-96 rounded-lg flex bg-[#333]" />
                                        </div>
                                    </li>
                                </div>
                            ))
                        }
                    </>
                ) || (
                        <>
                            {d.data?.map((x, idx) => (
                                <div className={`flex w-full justify-${idx % 2 == 0 ? "start" : "end"}`}>
                                    <li key={idx} style={{ backgroundColor: data.boxColor }} className={`md:w-1/2 rounded-lg shadow-lg p-8 flex flex-col gap-6`}>
                                        <div className="flex flex-col items-center md:items-start w-full">
                                            <CustomLink
                                                linkKey="module-github"
                                                name={x.name}
                                                href={x.web_url}
                                                className="group flex items-center mb-2 gap-3 hover:opacity-80 transition-opacity"
                                            >
                                                <h3 className="text-2xl font-bold group-hover:underline">
                                                    {x.name}
                                                </h3>

                                                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                                                    <Star size={16} />
                                                    <span className="text-sm font-medium">
                                                        {x.star_count.toLocaleString()}
                                                    </span>
                                                </div>
                                            </CustomLink>
                                        </div>
                                        <div className="flex-1 text-white text-base break-words">
                                            {x.description}
                                        </div>
                                    </li>
                                </div>

                            ))}
                        </>
                    )}

            </ul>

        </div>
    )
}