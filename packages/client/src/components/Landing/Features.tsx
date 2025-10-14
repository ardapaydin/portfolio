import { Palette, Zap, Globe, Lock, Pencil } from "lucide-react"

const features = [
    {
        icon: Zap,
        title: "Deploy in Seconds",
        description: "One-click deployment to production. Your portfolio goes live instantly.",
    },
    {
        icon: Palette,
        title: "Easy Customization",
        description: "Edit text, images, and content through our intuitive interface.",
    },
    {
        icon: Globe,
        title: "Custom Domain",
        description: "Connect your own domain or use our free subdomain.",
    },
    {
        icon: Lock,
        title: "Secure & Fast",
        description: "SSL certificates included. Lightning-fast load times guaranteed.",
    },
    {
        icon: Pencil,
        title: "Responsive Design",
        description: "Your portfolio looks great on all devices, from desktops to mobiles.",
    }
]
export default function Features() {
    return (
        <div className="border-y p border-[#363738]">
            <div className="max-w-7xl mx-auto">
                <div className="border-x border-[#363738]">
                    <div className="transition-all p-6 py-8 z-50 flex flex-col justify-center items-center text-center gap-6">
                        <h2 className="text-4xl font-bold mb-6 text-balance">
                            Features
                        </h2>
                        <div className="flex flex-row flex-wrap justify-center gap-6 w-full">
                            {features.map((feature) => (
                                <div key={feature.title} className="flex max-w-96 min-w-96 flex-col items-start text-start gap-4 p-6 border border-[#363738] rounded-lg transition-all">
                                    <div className="bg-black/50 p-2 rounded-lg">
                                        <feature.icon className="w-8 h-8 text-white/50" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                                    <p className="text-white/80">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}