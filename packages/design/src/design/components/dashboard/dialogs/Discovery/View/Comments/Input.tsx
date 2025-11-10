import type { TypeComment } from "@/design/types/comment";
import type { TypePortfolio } from "@/design/types/portfolio"
import type { TypeUser } from "@/design/types/user"
import { createComment } from "@/utils/api/comments";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react"

export default function CommentInput({ portfolio }: {
    portfolio: (TypePortfolio & { createdBy: TypeUser, url: string })
}) {
    const [value, setValue] = useState("");
    const qc = useQueryClient();
    const postComment = async () => {
        const create = await createComment(portfolio.id, value);
        if (create.status == 200) {
            setValue("");
            qc.setQueryData(["portfolio", portfolio.id, "comments"], (old: TypeComment[]) => ([...old, create.data.data]))
        }
    }

    return (
        <div className="flex items-center space-x-2">

            <input
                type="text"
                placeholder="Add a comment..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 rounded-lg px-4 bg-[#333] border-[#262626] border-4 focus:outline-none"
            />

            <button
                disabled={!(value.trim().length) || value.trim().length > 2048}
                onClick={() => postComment()}
                className="py-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 px-2 rounded-lg bg-green-500 border-b-8 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
            >
                <Send className="w-4 mt-2 h-4" />
            </button>

        </div>
    )
}