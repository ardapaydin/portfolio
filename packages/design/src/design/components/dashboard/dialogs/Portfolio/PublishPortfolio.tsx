import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { discovery, publish, save } from "@/utils/api/portfolio";
import { Check, CheckCircle2, Copy, Facebook, Mail } from "lucide-react";
import { LoadingSmall } from "../../../loading";
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

    const handleDiscoverable = async (discoverable: boolean) => {
        if (!id) return;

        const req = await discovery(id, discoverable);
        if (req.status == 200) { }
    }

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

                            <div className="flex gap-2 mb-4">
                                {[
                                    {
                                        name: "Facebook",
                                        icon: <Facebook size={20} />,
                                        url: `https://facebook.com/sharer/sharer.php?u=https://${siteUrl}`
                                    },
                                    {
                                        name: "X",
                                        icon: <svg width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>,
                                        url: `https://x.com/intent/post?url=https://${siteUrl}`
                                    },
                                    {
                                        name: "LinkedIn",
                                        icon: <svg width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                        </svg>,
                                        url: `https://linkedin.com/sharing/share-offsite/?url=https://${siteUrl}`
                                    },
                                    {
                                        name: "WhatsApp",
                                        icon: <svg width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>,
                                        url: `https://wa.me/?text=https://${siteUrl}`
                                    },
                                    {
                                        name: "Email",
                                        icon: <Mail size={20} />,
                                        url: `mailto:?subject=Check out my portfolio&body=https://${siteUrl}`
                                    },
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-white/10 rounded-lg transition"
                                        title={`Share on ${social.name}`}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 bg-[#333]/50 px-3 py-2 rounded-lg w-full justify-between">
                                {siteUrl && (
                                    <>
                                        <span className="font-mono text-sm select-all">{siteUrl}</span>
                                        <button
                                            onClick={handleCopy}
                                            className="ml-2 py-2 px-4 rounded-full cursor-pointer bg-green-500 transition"
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