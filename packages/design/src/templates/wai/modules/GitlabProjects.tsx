import { getGitlabProjects } from "@/utils/api/gitlab";
import { getPortfolioModule } from "@/utils/api/queries"
import { useParams } from "react-router-dom"
import { Section } from "../main";
import CustomLink from "@/templates/global/Link";

export default function WaiGitLabProjects({ data }: { data: Record<string, any> }) {
    const subdomain = process.env.NODE_ENV === "production"
        ? window.location.hostname.split('.')[0]
        : window.location.pathname.match(/\/view\/([^/]+)/)?.[1]!;
    const { id } = useParams()

    const module = getPortfolioModule(id || subdomain, 3);
    const d = getGitlabProjects(module.data?.slug, module.data?.config?.sort, module.data?.config?.max);
    if (module.isLoading || d.isLoading) return (
        <Section title="GitLab Projects">
            <div className="flex flex-col mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="animate-pulse h-1 w-32 rounded-lg flex bg-[#333]" />
                ))}
            </div>
        </Section>
    )

    return (
        <Section title="GitLab Projects">
            <ul className="flex flex-col gap-2 ml-6 list-disc">
                {d.data?.map((x) => (
                    <li key={x.name} style={{
                        color: data?.secondaryTextColor
                    }}>
                        <CustomLink href={x.web_url} linkKey="module-gitlab" name={x.name}>
                            {x.name}
                        </CustomLink>
                    </li>
                ))}
            </ul>
        </Section>
    )
}