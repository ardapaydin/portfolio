import { useRef, useState } from "react";
import { Image, UploadCloud } from "lucide-react";
import { UploadPicture } from "@/utils/api/attachments";
import { useParams } from "react-router-dom";

export default function UploadAttachment({ onSelect }: { onSelect: (uuid: string) => void; }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const { id } = useParams();
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formdata = new FormData();
        formdata.append("type", "picture");
        formdata.append("portfolioId", id!);
        formdata.append("file", file);

        const r = await UploadPicture(formdata)
    };

    return (
        <div className="border-3 border-dashed items-center p-6 py-10 rounded-lg cursor-pointer bg-white/10 justify-center flex flex-col gap-3 text-center" onClick={() => {
            fileInputRef.current?.click();
        }}>
            <Image className="h-14 w-14 text-white mb-2" />
            <h1 className="text-2xl font-semibold">
                Upload Attachment
            </h1>
            <p>
                Click here to upload an attachment or drag a file
            </p>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
            />
        </div>
    );
}