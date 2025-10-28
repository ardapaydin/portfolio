import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "lucide-react";
import { useParams } from "react-router-dom";
import Markdown from 'react-markdown'
import MarkdownComponents from "../global/Markdown";
import Attachments from "@/design/components/dashboard/dialogs/Attachments";
import { HeadProvider, Title, Link } from 'react-head';
import CustomLink from "../global/Link";
import "./index.css"
import EonGitHubRepos from "./modules/GithubRepos";
import EonGitLabProjects from "./modules/GitlabProjects";
export default function TemplateEon({ d }: { d?: any }) {
    const queryState = useQuery({
        queryKey: ["data"],
        queryFn: async () => { },
    })
    const data = d || queryState?.data as any;
    const qc = useQueryClient();
    const { id } = useParams();
    if (!data) return
    return (
        <div className="w-full h-full flex flex-col" style={{
            color: data.primaryTextColor
        }}>
            <HeadProvider>
                <Title>{data?.meta?.title}</Title>
                {data?.meta?.favicon && (
                    <Link rel="icon" type="image/png" href={`${import.meta.env.VITE_S3_URL}attachments/${data.meta.favicon}`} />
                )}
            </HeadProvider>

            <div className="relative w-full z-10" style={{ backgroundColor: data.backgroundColor }}>
                <div className="justify-between items-center flex w-full border-dashed p-4 mx-auto" style={{ maxWidth: "90%" }}>
                    <div className="flex" />
                    <div className="flex gap-2 items-center">
                        <a href="#home" style={{ color: data.primaryTextColor }} className="relative hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 px-2 py-1 rounded">
                            Home
                        </a>
                        <a href="#about" style={{ color: data.primaryTextColor }} className="relative hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 px-2 py-1 rounded">
                            About
                        </a>
                        <a href="#contact" style={{ color: data.primaryTextColor }} className="relative hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 px-2 py-1 rounded">
                            Contact
                        </a>
                    </div>
                </div>
            </div>

            <div id="home" className="flex-1 flex flex-col justify-center" style={{ paddingTop: "80px", backgroundColor: data.backgroundColor }}>
                <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto w-full py-32">
                    <div className="flex-1 flex flex-col justify-center items-start px-4">
                        <div className="uppercase text-sm tracking-widest text-white/50 mb-4" style={{
                            letterSpacing: "0.3rem"
                        }}>
                            Introduction
                        </div>
                        <div className="text-5xl font-bold leading-tight mb-2">
                            <span className="relative break-words">
                                {data.name}
                                <span className="absolute left-0 bottom-0 w-full h-3 bg-[#5F3EFF]" style={{ backgroundColor: data.underlineColor }} />
                            </span>
                        </div>
                        <div className="mt-4 text-lg text-gray-200 max-w-xl">
                            {data.bio}
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-4 mt-8 md:mt-0">
                        {(data?.picture && !id) &&
                            <img
                                className="w-full object-cover rounded-lg"
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
                                className="w-full object-cover rounded-lg"
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
                                <div className="flex items-center border-2 cursor-pointer bg-white/5 border-dashed justify-center rounded-lg w-64 h-96">
                                    <div className="text-center text-sm opacity-50">
                                        <Image className="w-12 h-12" />
                                    </div>
                                </div>
                            </Attachments>
                        )}

                    </div>
                </div>
            </div>

            <div id="about" className="flex flex-col relative">
                <div className="flex flex-col my-8 px-2 md:px-0 max-w-7xl mx-auto w-full">
                    <div className="uppercase text-sm tracking-widest text-white/50 mb-4" style={{
                        letterSpacing: "0.3rem"
                    }}>
                        About
                    </div>

                    <div className="relative break-words mb-2">
                        <span className="relative break-words text-5xl font-bold">
                            Projects
                            <span className="absolute left-0 bottom-0 w-64 h-7 -z-1" style={{ backgroundColor: data.underlineColor }} />
                        </span>

                        <p className="text-sm max-w-xl my-4 text-muted-foreground">
                            {data.projectsDescription}
                        </p>
                    </div>

                    <ul className="w-full flex flex-col gap-8">
                        {
                            data.projects
                                .map((item: { name: string, subtitle: string, description: string }, idx: number) => (
                                    <div className={`flex w-full justify-${idx % 2 == 0 ? "start" : "end"}`}>
                                        <li key={idx} style={{ backgroundColor: data.boxColor }} className={`md:w-1/2 rounded-lg shadow-lg p-8 flex flex-col md:flex-row${idx % 2 == 0 ? "-reverse" : ""} gap-6`}>
                                            <div className="flex flex-col items-center md:items-start md:w-1/4">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-2xl font-bold">{item.name}</span>
                                                </div>
                                                {item.subtitle && <span className="text-muted-foreground text-sm font-semibold">{item.subtitle}</span>}
                                            </div>
                                            <div className="flex-1 text-white text-base break-words">
                                                <Markdown components={MarkdownComponents({ dataKey: "projects" })}>
                                                    {item.description}
                                                </Markdown>
                                            </div>
                                        </li>
                                    </div>
                                ))}
                    </ul>

                </div>

                <div id="contact" className="flex flex-col my-8 px-2 md:px-0 max-w-7xl mx-auto w-full">
                    <div className="uppercase text-sm tracking-widest text-white/50 mb-4" style={{
                        letterSpacing: "0.3rem"
                    }}>
                        Contact
                    </div>

                    <div className="relative break-words mb-2">
                        <span className="relative break-words text-5xl font-bold">
                            Contact
                            <span className="absolute left-0 bottom-0 w-64 h-7 -z-1" style={{ backgroundColor: data.underlineColor }} />
                        </span>

                        <p className="text-sm max-w-xl my-4 text-muted-foreground">
                            {data.contactDescription}
                        </p>
                    </div>

                    <ul className="w-full flex flex-col gap-2">
                        {data.contact.map((item: { url: string, name: string }) => (
                            <li>
                                <CustomLink href={item.url} linkKey={"contact"} name={item.name}>
                                    {item.name}
                                </CustomLink>
                            </li>
                        ))}
                    </ul>

                </div>

                {data.modules?.find((x: number) => x == 1) && <EonGitHubRepos data={data} />}
                {data.modules?.find((x: number) => x == 3) && <EonGitLabProjects data={data} />}


                <div style={{ backgroundColor: data.secondaryBackgroundColor }}
                    className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

            </div>
        </div>
    )
}