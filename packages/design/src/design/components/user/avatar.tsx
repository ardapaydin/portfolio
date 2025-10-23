import type { ComponentProps } from "react";
import { useUser } from "../../../utils/api/queries";
import { cn } from "@/lib/utils";

export default function UserAvatar({
    className,
    ...props
}: {
    className?: string,
    props?: ComponentProps<'div'>
}) {
    const user = useUser();
    if (user.data?.user?.profilePicture) return (
        <div className={cn("w-10 h-10", className)}>
            <img
                className="w-full object-cover rounded-lg"
                src={`${import.meta.env.VITE_S3_URL}profilePictures/${user?.data?.user?.profilePicture}`}
            />

        </div>
    )
    const letter = user.data?.user?.name ? user.data.user.name.charAt(0).toUpperCase() : user.data?.user?.email ? user.data.user.email.charAt(0).toUpperCase() : "?";

    return (
        <div className={cn("w-10 h-10 text-xs rounded-lg bg-green-500/50 text-white flex items-center justify-center", className)} {...props}>
            {letter}
        </div>
    );
}
