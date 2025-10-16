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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-auto max-h-96">
            {attachments.data
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((attachment) => (
                    <button
                        type="button"
                        key={attachment.id}
                        onClick={() => onSelect(attachment.id)}
                        className="relative rounded-lg overflow-hidden cursor-pointer"
                    >
                        <img
                            src={`${import.meta.env.VITE_S3_URL}attachments/${attachment.id}`}
                            className="w-full h-40 object-cover bg-gray-100 transition-transform"
                            draggable={false}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-white text-xs truncate">
                            {attachment.name}
                        </div>
                    </button>
                ))}
        </div>
    )
}