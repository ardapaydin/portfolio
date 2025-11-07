import CustomLink from "@/templates/global/Link";
import { getGitlabProjects } from "@/utils/api/gitlab";
import { getPortfolioModule } from "@/utils/api/queries";
import { Gitlab, Star } from "lucide-react";
import { useParams } from "react-router-dom";

export default function CambaGitLabProjects({ data }: { data: Record<string, any> }) {
    const subdomain = process.env.NODE_ENV === "production"
        ? window.location.hostname.split('.')[0]
        : window.location.pathname.match(/\/view\/([^/]+)/)?.[1]!;
    const { id } = useParams();
    const module = getPortfolioModule(id || subdomain, 3);
    const d = getGitlabProjects(module.data?.slug, module.data?.config?.sort, module.data?.config?.max);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Gitlab style={{ color: data.secondaryTextColor }} />
                <h1 className="font-bold text-xl">GitLab Projects</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {d.isLoading ? (
                    <>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} style={{ backgroundColor: data.secondaryBoxColor }} className="flex max-h-min animate-pulse flex-col p-4 gap-2 rounded-lg border-2 border-[#252525] shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="animate-pulse h-4 w-32 rounded flex bg-[#333]" />
                                <div className="animate-pulse h-4 w-96 rounded flex bg-[#333]" />
                                <div className="animate-pulse h-4 w-42 rounded flex bg-[#333]" />
                            </div>
                        ))}
                    </>
                ) : (
                    d.data?.map((x) => (
                        <div key={x.id} style={{ backgroundColor: data.secondaryBoxColor }} className="flex max-h-min flex-col p-4 gap-2 rounded-lg border-2 border-[#252525] shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex flex-col gap-2">
                                <CustomLink
                                    linkKey="module-gitlab"
                                    name={x.name}
                                    href={x.web_url}
                                    className="group flex items-center mb-2 gap-3 hover:opacity-80 transition-opacity">
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

                                <div className="flex-1 text-white/50 text-base break-words">
                                    {x.description}
                                </div>
                            </div>
                        </div>
                    ))
                )}


            </div>
        </div>
    )
}