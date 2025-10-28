import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "lucide-react";
import { useParams } from "react-router-dom";
import Markdown from 'react-markdown'
import MarkdownComponents from "../global/Markdown";
import Attachments from "@/design/components/dashboard/dialogs/Attachments";
import { HeadProvider, Title, Link } from 'react-head';
import CustomLink from "../global/Link";
import WaiGitHubRepos from "./modules/GithubRepos";
import GitHubReadme from "../global/Modules/GitHubReadMe";
import WaiGitLabProjects from "./modules/GitlabProjects";

export default function TemplateWai({ d }: { d?: any }) {
    const queryState = useQuery({
        queryKey: ["data"],
        queryFn: async () => { },
    })
    const data = d || queryState?.data as any;
    const qc = useQueryClient();
    const { id } = useParams();

    return (
        <div
            className="w-full h-screen flex flex-col md:flex-row text-white"
        >
            <HeadProvider>
                <Title>{data?.meta?.title}</Title>
                {data?.meta?.favicon && (
                    <Link rel="icon" type="image/png" href={`${import.meta.env.VITE_S3_URL}attachments/${data.meta.favicon}`} />
                )}
            </HeadProvider>
            <div className="max-w-2xl m-auto w-full flex flex-col">
                <div
                    style={{ backgroundColor: data?.backgroundColor }}
                    className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="py-16 px-4 md:px-10 rounded-lg shadow-2xl overflow-auto max-h-[80vh]" style={{
                    backgroundColor: data?.boxColor + "40"
                }}>
                    <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold mb-2 truncate w-96"
                                style={{ color: data?.primaryTextColor }}
                            >{data?.name}</h1>
                            <p
                                style={{
                                    color: data?.secondaryTextColor
                                }}
                                className="text-lg italic opacity-70 break-words w-96">{data?.jobTitle}</p>
                        </div>
                        {(data?.picture && !id) &&
                            <img
                                className="w-32 h-32 object-cover rounded-full border-4 border-white/20"
                                src={`${import.meta.env.VITE_S3_URL}attachments/${data.picture}`}
                            />
                        }

                        {(id && data.picture) && <Attachments onSelect={(uuid: string) => {
                            qc.setQueryData(["data"], {
                                ...qc.getQueryData(["data"]),
                                picture: uuid
                            })
                        }}>
                            <img
                                className="w-32 h-32 object-cover rounded-full cursor-pointer border-4 border-white/20"
                                src={`${import.meta.env.VITE_S3_URL}attachments/${data.picture}`}
                            />
                        </Attachments>
                        }

                        {(id && !data?.picture) && (
                            <Attachments onSelect={(uuid: string) => {
                                qc.setQueryData(["data"], {
                                    ...qc.getQueryData(["data"]),
                                    picture: uuid
                                })
                            }}>
                                <div className="flex items-center border-2 cursor-pointer bg-white/5 border-dashed justify-center rounded-lg w-32 h-32">
                                    <div className="text-center text-sm opacity-50">
                                        <Image className="w-12 h-12" />
                                    </div>
                                </div>
                            </Attachments>
                        )}
                    </div>

                    <div className="mt-2 text-lg leading-relaxed break-words whitespace-normal" style={{
                        color: data?.primaryTextColor
                    }}>
                        {data?.modules?.find((x: number) => x == 2) && <GitHubReadme data={data} /> ||
                            <Markdown components={MarkdownComponents({ dataKey: "bio" })}>{data?.bio}</Markdown>}
                    </div>

                    <Section title="Links">
                        <ul className="flex flex-col gap-2 ml-6 list-disc">
                            {data?.links?.map((link: { name: string, url: string }) => (
                                <li key={link.name} style={{ color: data?.secondaryTextColor }}>
                                    <CustomLink href={link.url} linkKey={"links"} name={link.name}>
                                        {link.name}
                                    </CustomLink>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="Projects">
                        <ul className="flex flex-col gap-2 ml-6 list-disc">
                            {data?.projects?.map((project: { name: string, url: string }) => (
                                <li key={project.name} style={{ color: data?.secondaryTextColor }}>
                                    <CustomLink href={project.url} linkKey={"projects"} name={project.name}>
                                        {project.name}
                                    </CustomLink>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    {data?.modules?.find((x: number) => x == 1) && <WaiGitHubRepos data={data} />}
                    {data?.modules?.find((x: number) => x == 3) && <WaiGitLabProjects data={data} />}
                </div>
            </div>
        </div>
    )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mt-8">
            <p className="font-semibold mb-2">{title}</p>
            {children}
        </div>
    )
}