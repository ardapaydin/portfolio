import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Image, Locate, Mail } from "lucide-react";
import { useParams } from "react-router-dom";
import Markdown from 'react-markdown'
import MarkdownComponents from "../global/Markdown";
import Attachments from "@/design/components/dashboard/dialogs/Attachments";
import { HeadProvider, Title, Link } from 'react-head';
import CambaGitHubRepos from "./modules/GithubRepos";

export default function TemplateCamba({ d }: { d?: any }) {
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
            color: data?.primaryTextColor,
            backgroundColor: data?.backgroundColor
        }}>
            <HeadProvider>
                <Title>{data?.meta?.title}</Title>
                {data?.meta?.favicon && (
                    <Link rel="icon" type="image/png" href={`${import.meta.env.VITE_S3_URL}attachments/${data.meta.favicon}`} />
                )}
            </HeadProvider>


            <div className="max-w-7xl mx-auto flex-col md:flex-row flex w-full my-12 gap-8 px-4">
                <div style={{
                    backgroundColor: data.boxColor,
                    borderColor: data.borderColor
                }} className="flex-col gap-6 border-2 shadow-lg p-8 rounded-2xl w-full md:w-1/4 items-center flex justify-center max-h-min transition-all">
                    <div className="flex justify-center overflow-hidden max-w-48 max-h-48">
                        {(data?.picture && !id) &&
                            <img
                                className="w-full h-full object-cover transition-transform duration-300"
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
                                className="w-full h-full object-cover transition-transform duration-300"
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
                                <div className="flex items-center border-2 cursor-pointer bg-white/5 border-dashed justify-center w-full h-full">
                                    <div className="text-center text-sm opacity-50">
                                        <Image className="w-12 h-12" />
                                    </div>
                                </div>
                            </Attachments>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-2xl font-bold">
                            {data.name}
                        </h1>

                        <span className="bg-[#2f2f2f] px-4 py-1 text-sm rounded font-medium">
                            {data.jobTitle}
                        </span>
                    </div>

                    <hr className="w-full border-[#333333] my-2" />

                    <div className="flex flex-col w-full gap-5">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#333333] p-3 rounded-xl shadow" style={{ color: data.secondaryTextColor }}>
                                <Mail size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email</span>
                                <a
                                    href={`mailto:${data.email}`}
                                    className="text-sm hover:underline transition-colors" style={{ color: data.secondaryTextColor }}
                                >
                                    {data.email}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-[#333333] p-3 rounded-xl shadow" style={{ color: data.secondaryTextColor }}>
                                <Locate size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Location</span>
                                <span className="text-sm">
                                    {data.location}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{
                    backgroundColor: data.boxColor,
                    borderColor: data.borderColor
                }} className="overflow-auto h-[52rem] flex-col gap-6 border-2 shadow-lg p-8 rounded-2xl w-full flex transition-all">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-4">
                            <h1 className="font-bold text-3xl">About Me</h1>
                            <div className="h-1 w-16 rounded-2xl" style={{ backgroundColor: data.underlineColor }} />
                        </div>
                    </div>

                    <span className="break-words text-white/80">
                        <Markdown components={MarkdownComponents({ dataKey: "bio" })}>
                            {data.bio}
                        </Markdown>
                    </span>

                    <div className="flex flex-col gap-4">
                        <h1 className="font-bold text-xl">What i'm doing</h1>
                        <div className="grid md:grid-cols-2 gap-8">
                            {data.services.map((x: { name: string, description: string }) => (
                                <div style={{ backgroundColor: data.secondaryBoxColor }} className="flex max-h-min flex-col p-4 gap-2 rounded-lg border-2 border-[#252525] shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <h1 className="font-bold">{x.name}</h1>
                                    <span className="text-white/80 text-sm break-words">
                                        <Markdown components={MarkdownComponents({ dataKey: "services" })}>
                                            {x.description}
                                        </Markdown>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="flex flex-col gap-4">
                            <h1 className="font-bold text-3xl">Resume</h1>
                            <div className="h-1 w-16 rounded-2xl" style={{ backgroundColor: data.underlineColor }} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#202022] p-2 rounded-lg">
                                <BookOpen style={{ color: data.secondaryTextColor }} />
                            </div>
                            <h1 className="font-bold text-xl">Education</h1>
                        </div>
                        <div className="flex flex-col gap-6">
                            {data.education.map((x: { name: string, period: string, description: string }, index: number, array: string[]) => (
                                <div className="flex gap-6 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-yellow-200 border-2 border-black/50" />
                                        {index !== array.length - 1 && (
                                            <div className="w-[2px] h-full bg-[#333333] absolute top-4" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 pb-6">
                                        <div className="flex items-end gap-1">
                                            <h2 className="font-bold text-lg">{x.name}</h2>
                                            <span style={{ color: data.secondaryTextColor }} className="text-sm">{x.period}</span>
                                        </div>
                                        <p className="text-white/80 text-sm">
                                            <Markdown components={MarkdownComponents({ dataKey: "education" })}>
                                                {x.description}
                                            </Markdown>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen style={{ color: data.secondaryTextColor }} />
                            <h1 className="font-bold text-xl">Experience</h1>
                        </div>
                        <div className="flex flex-col gap-6">
                            {data.experience.map((x: { name: string, period: string, description: string }, index: number, array: string[]) => (
                                <div className="flex gap-6 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-yellow-200 border-2 border-black/50" />
                                        {index !== array.length - 1 && (
                                            <div className="w-[2px] h-full bg-[#333333] absolute top-4" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 pb-6">
                                        <div className="flex items-end gap-1">
                                            <h2 className="font-bold text-lg">{x.name}</h2>
                                            <span style={{
                                                color: data.secondaryTextColor
                                            }} className="text-sm">{x.period}</span>
                                        </div>
                                        <p className="text-white/80 text-sm">
                                            <Markdown components={MarkdownComponents({ dataKey: "experience" })}>
                                                {x.description}
                                            </Markdown>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {data?.modules?.find((x: number) => x == 1) && <CambaGitHubRepos data={data} />}


                </div>
            </div>
        </div>
    )
}