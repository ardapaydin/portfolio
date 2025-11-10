import UserAvatar from "@/design/components/user/avatar";
import type { TypeComment } from "@/design/types/comment";
import type { TypePortfolio } from "@/design/types/portfolio";
import type { TypeUser } from "@/design/types/user";
import { deleteComment, updateComment } from "@/utils/api/comments";
import { useUser } from "@/utils/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Send, Trash } from "lucide-react";
import { useState } from "react";

export default function Comment({ portfolio, comment }: {
    portfolio: (TypePortfolio & { createdBy: TypeUser, url: string }),
    comment: TypeComment
}) {
    const user = useUser();
    const qc = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const delComment = async () => {
        const req = await deleteComment(portfolio.id, comment.id);
        if (req.status == 200) qc.setQueryData(["portfolio", portfolio.id, "comments"], (old: TypeComment[]) => old.filter((x) => x.id != comment.id))
    }

    const updComment = async () => {
        if (content == comment.content) return setIsEditing(false);
        const req = await updateComment(portfolio.id, comment.id, content);
        if (req.status == 200) {
            setIsEditing(false);
            qc.setQueryData(["portfolio", portfolio.id, "comments"], (old: TypeComment[]) => old.map((c) => {
                if (comment.id == c.id) return { ...c, content }
                else return c
            }))
        }
    }

    return (
        <div className="justify-between flex group gap-2">
            <div className="flex flex-col w-full">
                <div className="flex gap-2 w-full">
                    <UserAvatar className="w-8 h-8 min-w-8 min-h-8" userData={comment.createdBy} />
                    <div className="flex flex-col w-full">
                        <p className="text-sm">{comment.createdBy.name}</p>
                        {isEditing && (
                            <div className="flex w-full items-center">
                                <input
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full p-2 rounded-lg px-4 bg-[#333] border-[#262626] border-4 focus:outline-none"
                                />

                                <button
                                    onClick={() => updComment()}
                                    disabled={!(content.trim().length) || content.trim().length > 2048}
                                    className="py-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 px-2 rounded-lg bg-green-500 border-b-8 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                                >
                                    <Send className="w-4 mt-2 h-4" />
                                </button>
                            </div>
                        ) ||
                            <p className="text-white/60 break-all whitespace-pre-wrap">{comment.content}</p>
                        }
                    </div>
                </div>
            </div>
            {user.data?.user?.id == comment.createdBy.id && (
                <div className={`gap-2 ${!isEditing ? "hidden" : "flex"} group-hover:flex items-center`}>
                    <Pencil onClick={() => setIsEditing(!isEditing)} className="min-w-4 w-4 opacity-50 hover:opacity-100 transition duration-300 cursor-pointer" />
                    {!isEditing &&
                        <Trash className="min-w-4 w-4 text-red-400 opacity-50 hover:opacity-100 transition duration-300 cursor-pointer " onClick={() => delComment()} />
                    }
                </div>
            )}
        </div>

    )
}