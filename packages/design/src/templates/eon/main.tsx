import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "lucide-react";
import { useParams } from "react-router-dom";
import Markdown from 'react-markdown'
import MarkdownComponents from "../global/Markdown";
import Attachments from "@/design/components/dashboard/dialogs/Attachments";
import { HeadProvider, Title, Link } from 'react-head';
import CustomLink from "../global/Link";
export default function TemplateEon({ d }: { d?: any }) {
    const queryState = useQuery({
        queryKey: ["data"],
        queryFn: async () => { },
    })
    const data = d || queryState?.data as any;
    const qc = useQueryClient();
    const { id } = useParams();

    return (
        <div className="w-full h-full flex flex-col text-white">
            <HeadProvider>
                <Title>{data?.meta?.title}</Title>
                {data?.meta?.favicon && (
                    <Link rel="icon" type="image/png" href={`${import.meta.env.VITE_S3_URL}attachments/${data.meta.favicon}`} />
                )}
            </HeadProvider>

            <div className="fixed w-full bg-[#282828] z-10">
                <div className="justify-between items-center flex w-full border-dashed p-4 mx-auto" style={{ maxWidth: "90%" }}>
                    <div className="flex">
                        EON
                    </div>
                    <div className="flex gap-2 items-center">
                        <a href="/" className="relative text-white hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 px-2 py-1 rounded">
                            Home
                        </a>
                        <a href="/" className="relative text-white hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 px-2 py-1 rounded">
                            About
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center bg-[#282828]" style={{ paddingTop: "80px" }}>
                <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto w-full py-32">
                    <div className="flex-1 flex flex-col justify-center items-start px-4">
                        <div className="uppercase text-sm tracking-widest text-white/50 mb-4" style={{
                            letterSpacing: "0.3rem"
                        }}>
                            Introduction
                        </div>
                        <div className="text-5xl font-bold leading-tight mb-2">
                            Welcome to <br />
                            <span className="relative break-words">
                                Eon
                                <span className="absolute left-0 bottom-0 w-full h-3 bg-[#5F3EFF]" />
                            </span>
                        </div>
                        <div className="mt-4 text-lg text-gray-200 max-w-xl">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea distinctio beatae ab aliquid doloremque.
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-4 mt-8 md:mt-0">
                    </div>
                </div>
            </div>

            <div className="flex flex-col relative">
                <div className="flex flex-col my-8 max-w-7xl mx-auto w-full">
                    <div className="uppercase text-sm tracking-widest text-white/50 mb-4" style={{
                        letterSpacing: "0.3rem"
                    }}>
                        About
                    </div>

                    <div className="relative break-words mb-2">
                        <span className="relative break-words text-5xl font-bold">
                            Projects
                            <span className="absolute left-0 bottom-0 w-64 h-7 -z-10 bg-[#5F3EFF]" />
                        </span>

                        <p className="text-sm max-w-xl my-4 text-muted-foreground">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi amet et minus dolores assumenda error unde, mollitia, dignissimos quas aut incidunt a quae debitis accusantium beatae adipisci, cumque laudantium nobis?
                        </p>
                    </div>
                </div>
                <div
                    className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

            </div>
        </div>
    )
}