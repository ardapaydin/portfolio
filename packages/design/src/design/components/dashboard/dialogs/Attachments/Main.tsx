import { LoadingSmall } from "@/design/components/loading";
import { GetAttachments } from "@/utils/api/queries";
import { Image } from "lucide-react";
import { useParams } from "react-router-dom";

export default function MainAttachments({ onSelect }: { onSelect: (uuid: string) => void; }) {
    const { id } = useParams();
    const attachments = GetAttachments(id!);
    if (attachments.isLoading) return <LoadingSmall />
    if (!attachments.data?.length) return (
        <div className="border border-dashed items-center p-6 py-10 rounded-lg bg-white/10 justify-center flex flex-col gap-3 text-center">
            <Image className="h-14 w-14 text-white mb-2" />
            <h1 className="text-2xl font-semibold">
                No Attachments Found
            </h1>
            <p className="text-white/50 text-sm">
                You haven{"'"}t uploaded any attachments yet.
            </p>
        </div>
    )
    return (
        <div></div>
    )
}