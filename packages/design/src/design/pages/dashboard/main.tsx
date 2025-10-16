import { useUser } from "@/utils/api/queries";
import Layout from "../../components/dashboard/layout";
import { User } from "lucide-react";

export default function Dashboard() {
    const user = useUser();
    return (
        <Layout>
            <div className="text-gray-300 text-2xl font-medium">
                <User className="inline-block w-6 mr-2 mb-1 text-yellow-300" />
                Hello <span className="text-white font-semibold">{user?.data?.user?.name}</span>!
            </div>
        </Layout>
    )
}