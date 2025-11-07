import { getGitHubReadme } from "@/utils/api/github";
import { getPortfolioModule } from "@/utils/api/queries";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom"
import MarkdownComponents from "../Markdown";

export default function GitHubReadme({ data }: { data: Record<string, any> }) {
    const subdomain = process.env.NODE_ENV === "production"
        ? window.location.hostname.split('.')[0]
        : window.location.pathname.match(/\/view\/([^/]+)/)?.[1]!;
    const { id } = useParams();

    const module = getPortfolioModule(id || subdomain!, 2);
    const d = getGitHubReadme(module.data?.slug, module.data?.config?.branch)

    return (
        <>
            {d.isLoading && (
                <div className="flex flex-col gap-1">
                    <div className="w-96 h-2 animate-pulse bg-[#333]"></div>
                    <div className="w-64 h-2 animate-pulse bg-[#333]"></div>
                    <div className="w-32 h-2 animate-pulse bg-[#333]"></div>
                    <div className="w-48 h-2 animate-pulse bg-[#333]"></div>
                </div>
            ) || d.data?.status == 404 && (
                <>
                    {id && (
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-xl font-semibold">
                                GitHub README.md Not Found
                            </span>
                            <p className="mt-2 text-muted-foreground">
                                This user doesn't have a README.md file or it might be private.
                            </p>
                        </div>
                    ) || <Markdown components={MarkdownComponents({ dataKey: "bio" })}>{data?.bio}</Markdown>}
                </>
            ) || (
                    <Markdown components={MarkdownComponents({ dataKey: "github-module" })}>
                        {d.data?.data}
                    </Markdown>
                )}
        </>
    )
}