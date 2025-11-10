import type { TypePortfolio } from "@/design/types/portfolio";
import type { TypeUser } from "@/design/types/user";
import { Send } from "lucide-react";
import CommentInput from "./Comments/Input";
import { usePortfolioComments } from "@/utils/api/queries";
import { LoadingSmall } from "@/design/components/loading";

export default function Comments({ portfolio, enabled }: {
    portfolio: (TypePortfolio & { createdBy: TypeUser, url: string }),
    enabled: boolean
}) {
    const comments = usePortfolioComments(portfolio.id, enabled);

    return (
        <div className="flex flex-1 flex-col ">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.isLoading && <LoadingSmall />}
                {!comments.isLoading && Array.isArray(comments.data) && comments.data.map((comment) => (
                    <div>
                        {comment.content}
                    </div>
                ))}
            </div>
            <div className="p-4">
                <CommentInput portfolio={portfolio} />
            </div>
        </div>
    )
}