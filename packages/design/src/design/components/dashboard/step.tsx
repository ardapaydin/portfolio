import { usePortfolios, useUser } from "@/utils/api/queries";
import { ArrowRight, Check, List, Mail, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingSmall } from "../loading";

const steps = [
    {
        title: "Verify Your Email",
        description: "Check your inbox and click the verification link to activate your account.",
        icon: <Mail className="w-4 h-4" />
    },
    {
        title: "Create a Portfolio",
        description: "Choose a template and personalize your portfolio with your information and projects.",
        icon: <List className="w-4 h-4" />,
        path: "/dashboard/templates"
    },
    {
        title: "Publish",
        description: "Review your portfolio and publish it to make it visible to others.",
        icon: <UploadIcon className="w-4 h-4" />
    }
]

export default function Step() {
    const portfolios = usePortfolios();
    const user = useUser();
    const [userStep, setUserStep] = useState(0)
    useEffect(() => {
        if (portfolios.data?.length) setUserStep(2)
        if (portfolios.data?.find(((x) => x.isPublished))) setUserStep(3)
        if (!user.data?.user?.emailVerified) setUserStep(0)
    }, [portfolios.data, user.data])
    if (portfolios.isLoading) return <LoadingSmall />

    return (
        <div className="bg-[#222222] p-8 rounded-md flex flex-col border shadow-lg border-[#303030]">
            <div className="flex justify-between items-center">
                <h1>Complete Steps</h1>
                <span className="text-muted-foreground text-xs">
                    {userStep} of {steps.length} complete
                </span>
            </div>

            <hr className="border-[#303030] mt-2" />

            <div className="flex flex-col gap-2 mt-2">
                {steps.map((step, i) => (
                    <div className="bg-[#191919] px-4 py-4 rounded-md border-[#303030] border">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#252525] p-2 rounded-lg">
                                    {step.icon}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h1 className="text-sm">{step.title}</h1>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                </div>
                            </div>

                            <div>
                                {(userStep > i) && (
                                    <Check className="text-green-500 w-6 h-6" />
                                ) || (step.path) && (
                                    <Link to={step.path}>
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}