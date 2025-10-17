import { useUser } from "@/utils/api/queries";
import Layout from "../../components/dashboard/layout";
import { MailQuestion, Projector, User } from "lucide-react";
import Step from "@/design/components/dashboard/step";
import Portfolios from "@/design/components/dashboard/portfolios";

export default function Dashboard() {
    const user = useUser();
    return (
        <Layout>
            <div className="text-gray-300 text-2xl font-medium mb-8">
                <User className="inline-block w-6 mr-2 mb-1 text-yellow-300" />
                Hello <span className="text-white font-semibold">{user?.data?.user?.name}</span>!
            </div>

            {!user?.data?.user?.emailVerified && (
                <div className="bg-red-500/20 border flex gap-2 items-center border-red-600 p-3 rounded-lg mb-4">
                    <div className="p-2 bg-[#252525]/50 rounded-lg">
                        <MailQuestion />
                    </div>

                    <div className="flex flex-col">
                        <h1 className="font-semibold text-white text-sm">
                            Email address not verified
                        </h1>
                        <p className="text-muted-foreground mt-1 text-xs">
                            Please verify your email to create or edit portfolios. Check your inbox (and spam folder) for the verification link.
                        </p>
                    </div>
                </div>
            )}

            <Step />
            <div className="text-gray-300 text-2xl font-medium mb-8 mt-8">
                <Projector className="inline-block w-6 mr-2 mb-1 text-yellow-300" />
                Portfolios
            </div>
            <Portfolios />

        </Layout>
    )
}