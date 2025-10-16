import { useUser } from "@/utils/api/queries";
import Layout from "../../components/dashboard/layout";
import { Projector, User } from "lucide-react";
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

            <Step />
            <div className="text-gray-300 text-2xl font-medium mb-8 mt-8">
                <Projector className="inline-block w-6 mr-2 mb-1 text-yellow-300" />
                Portfolios
            </div>
            <Portfolios />

        </Layout>
    )
}