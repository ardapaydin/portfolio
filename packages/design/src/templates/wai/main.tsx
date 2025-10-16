import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "lucide-react";
import { useParams } from "react-router-dom";
import Markdown from 'react-markdown'
import MarkdownComponents from "../global/Markdown";
import Attachments from "@/design/components/dashboard/dialogs/Attachments";

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
            <div className="max-w-2xl m-auto w-full flex flex-col">
                <div
                    style={{ backgroundColor: data?.backgroundColor }}
                    className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="py-16 px-4 md:px-10 rounded-lg shadow-2xl" style={{
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
                        {data?.picture &&
                            <img
                                className="w-32 h-32 object-cover rounded-full border-4 border-white/20"
                                src={data?.picture}
                            />
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

                    <p className="mt-2 text-lg leading-relaxed break-words" style={{
                        color: data?.primaryTextColor
                    }}>
                        <Markdown components={MarkdownComponents()}>{data?.bio}</Markdown>
                    </p>

                    <Section title="Links">
                        <ul className="flex flex-col gap-2 ml-6 list-disc">
                            {data?.links.map((link: { name: string, url: string }) => (
                                <li key={link.name} style={{ color: data?.secondaryTextColor }}>
                                    <a href={link.url} className="underline break-words hover:text-blue-400 transition-colors">{link.name}</a>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="Projects">
                        <ul className="flex flex-col gap-2 ml-6 list-disc">
                            {data?.projects.map((project: { name: string, url: string }) => (
                                <li key={project.name} style={{ color: data?.secondaryTextColor }}>
                                    <a href={project.url} className="underline break-words hover:text-blue-400 transition-colors">{project.name}</a>
                                </li>
                            ))}
                        </ul>
                    </Section>
                </div>
            </div>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mt-8">
            <p className="font-semibold mb-2">{title}</p>
            {children}
        </div>
    )
}