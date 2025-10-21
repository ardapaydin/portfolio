import { type AnchorHTMLAttributes, type BlockquoteHTMLAttributes, type HTMLAttributes, type ImgHTMLAttributes, type LiHTMLAttributes } from "react";
import CustomLink from "./Link";

export default function MarkdownComponents() {
    return {
        h1: (props: HTMLAttributes<HTMLHeadingElement>) => (<h1 {...props} className="text-2xl font-bold my-4">{props.children}</h1>),
        h2: (props: HTMLAttributes<HTMLHeadingElement>) => (<h2 {...props} className="text-xl font-bold my-3">{props.children}</h2>),
        h3: (props: HTMLAttributes<HTMLHeadingElement>) => (<h3 {...props} className="text-lg font-bold my-2">{props.children}</h3>),
        a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (<CustomLink linkKey="markdown" {...props} className="underline break-words hover:text-blue-400 transition-colors">{props.children}</CustomLink>),
        p: (props: HTMLAttributes<HTMLParagraphElement>) => (<p {...props} className="my-2">{props.children}</p>),
        li: (props: LiHTMLAttributes<HTMLLIElement>) => (<li {...props} className="my-1">{props.children}</li>),
        ul: (props: HTMLAttributes<HTMLUListElement>) => (<ul {...props} className="list-disc ml-6 my-2">{props.children}</ul>),
        blockquote: (props: BlockquoteHTMLAttributes<HTMLElement>) => (<blockquote {...props} className="border-l-4 pl-4 italic my-2 border-gray-600">{props.children}</blockquote>),
        img: (props: ImgHTMLAttributes<HTMLImageElement>) => (<p className="my-2">![{props.alt}]({props.src})</p>),
        hr: () => (<div className="flex gap-1 items-center justify-center w-full">
            <div className="w-1 bg-muted-foreground h-1 rounded-full" />
            <div className="w-1 bg-muted-foreground h-1 rounded-full" />
            <div className="w-1 bg-muted-foreground h-1 rounded-full" />
        </div>)
    }
}