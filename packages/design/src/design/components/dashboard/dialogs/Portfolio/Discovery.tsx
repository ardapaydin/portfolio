import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { TypePortfolio } from "@/design/types/portfolio";

export default function PortfolioDiscoveryState({ children, portfolio }: { children: React.ReactNode, portfolio: TypePortfolio }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>

            </DialogContent>
        </Dialog>
    )
}