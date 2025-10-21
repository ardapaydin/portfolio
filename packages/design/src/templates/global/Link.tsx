import { cn } from "@/lib/utils";
import { SendEvent } from "@/utils/api/event";
import type { ComponentProps } from "react";
const subdomain = process.env.NODE_ENV == "production" ? window.location.hostname.split('.')[0] : window.location.pathname.split("/view/")?.[1]


export default function CustomLink({
    linkKey,
    children,
    ...props
}: {
    linkKey: string;
    children: React.ReactNode;
} & ComponentProps<'a'>) {
    return (
        <a
            onClick={() => SendEvent(subdomain, "clickLink", { key: linkKey, url: props.href })}
            className={cn("underline break-words hover:text-blue-400 transition-colors", props.className)}
            {...props}
        >
            {children}
        </a>
    )
}