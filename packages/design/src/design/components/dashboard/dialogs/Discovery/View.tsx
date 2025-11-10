import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { TypePortfolio } from "@/design/types/portfolio";
import type { TypeUser } from "@/design/types/user";
import { useState } from "react";
import Browser from "./View/Browser";
import Comments from "./View/Comments";

export default function ViewPortfolio({ children, portfolio }: { children: React.ReactNode, portfolio: (TypePortfolio & { createdBy: TypeUser, url: string }) }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="h-screen p-0 min-w-screen overflow-auto">
                <div className="flex md:flex-row flex-col">
                    <div className="md:w-4/5">
                        <Browser portfolio={portfolio} />
                    </div>
                    <Comments portfolio={portfolio} enabled={isOpen} />
                </div>
            </DialogContent>
        </Dialog>
    )
}