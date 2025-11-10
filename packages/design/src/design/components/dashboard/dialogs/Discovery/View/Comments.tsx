import type { TypePortfolio } from "@/design/types/portfolio";
import type { TypeUser } from "@/design/types/user";
import CommentInput from "./Comments/Input";
import { usePortfolioComments } from "@/utils/api/queries";
import { LoadingSmall } from "@/design/components/loading";
import Comment from "./Comments/Comment";
import { FileWarning } from "lucide-react";

export default function Comments({ portfolio, enabled }: {
    portfolio: (TypePortfolio & { createdBy: TypeUser, url: string }),
    enabled: boolean
}) {
    const comments = usePortfolioComments(portfolio.id, enabled);
    return (
        <div className="flex flex-1 flex-col ">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex flex-col justify-center">
                    <span className="mb-4 flex w-full">Comments</span>
                    <hr className="border-[#333] w-full" />
                </div>
                {comments.isLoading && <LoadingSmall />}
                {!comments.isLoading && Array.isArray(comments.data) && comments.data.map((comment) => <Comment comment={comment} portfolio={portfolio} />)}
                {!comments.isLoading && Array.isArray(comments.data) && !comments.data.length && (
                    <div className="flex flex-col h-full justify-center items-center">
                        <FileWarning className="w-15 h-15 mb-2 text-muted-foreground" />
                        <h1 className="text-3xl font-bold mb-2">
                            No Comments Yet
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Be the first to share your thoughts!
                        </p>
                    </div>
                )}
            </div>
            <div className="p-4">
                <CommentInput portfolio={portfolio} />
            </div>
        </div>
    )
}