import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publish, save } from "@/utils/api/portfolio";
import { Check, CheckCircle2, Copy } from "lucide-react";
import { LoadingSmall } from "../../loading";
import { GetPortfolioState } from "@/utils/api/queries";
import confetti from "canvas-confetti"
export default function PublishPortfolio({ children }: { children: React.ReactNode }) {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [siteUrl, setSiteUrl] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const state = GetPortfolioState(id!, !isLoading && isOpen)
    useEffect(() => {
        if (isOpen) save(id!);
    }, [isOpen])
    const handlePublish = async () => {
        if (!id) return;
        const pub = await publish(id);
        setIsLoading(false);
        if (pub.status === 200) {
            if (pub.data.isNew) handleConfetti();
            setSiteUrl(pub.data.domain ?? "");
            setIsOpen(true);
        }
    };

    const handleCopy = () => {
        if (siteUrl) {
            navigator.clipboard.writeText(siteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    };
    const handleConfetti = () => {
        const animationEnd = Date.now() + 5000
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min
        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now()
            if (timeLeft <= 0) return clearInterval(interval)
            const particleCount = 50 * (timeLeft / 5000)
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                zIndex: 60
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                zIndex: 60
            })
        }, 250)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <span onClick={handlePublish}>{children}</span>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-auto rounded-xl shadow-xl p-8 text-center">
                {(isLoading && !state.isLoading) && (
                    <div className="flex flex-col gap-2 m-12">
                        <LoadingSmall />
                        <span className="text-muted-foreground">Hang tight! Your portfolio is being published...</span>
                    </div>
                ) || (
                        <div className="flex flex-col items-center gap-3">
                            <CheckCircle2 className="text-green-500" size={40} />
                            <h2 className="text-2xl font-bold">Congratulations!</h2>
                            <p className="text-white/50 mb-2">
                                Your site is published and live online.
                            </p>
                            <div className="flex items-center gap-2 bg-[#333]/50 px-3 py-2 rounded-lg w-full justify-center">
                                {siteUrl && (
                                    <>
                                        <span className="font-mono text-sm select-all">{siteUrl}</span>
                                        <button
                                            onClick={handleCopy}
                                            className="ml-2 p-1 rounded cursor-pointer bg-[#333] transition"
                                            title="Copy URL"
                                        >
                                            {copied && (
                                                <Check className="w-4 h-4 text-green-500" />
                                            ) || (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                        </button>
                                    </>
                                )}
                            </div>
                            <span
                                className={`text-sm px-3 py-1 rounded-full font-medium ${state.data?.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700 animate-pulse"
                                    }`}
                            >
                                Domain status:{" "}
                                {state.data?.status === "active"
                                    ? "Active"
                                    : "Validating..."}
                            </span>
                            <a
                                href={"https://" + siteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 py-2  disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"                    >
                                View Site
                            </a>
                        </div>
                    )}
            </DialogContent>
        </Dialog>
    );
}