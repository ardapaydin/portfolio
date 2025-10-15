import { useVerfyEmail } from "../../utils/api/queries";
import { useEffect } from "react";

export default function VerifyEmail() {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    const { data, isLoading, isError } = useVerfyEmail(token ?? "");

    useEffect(() => {
        if (!token) window.location.replace("/auth/login");
        if (data?.success) window.location.replace("/auth/login?verified=true");
    }, [token, data]);

    if (!token || isLoading) return;
    if (isError) return <div className="text-red-500">An error occurred. Please try again later.</div>;
    if (data?.success) return;

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#242424]/50 backdrop-blur-sm">
            <div className="text-red-500 bg-[#313131] border border-red-500/50 font-bold px-6 py-4 rounded">
                {data?.message || "An error occurred. Please try again later."}
            </div>
        </div>
    );
}