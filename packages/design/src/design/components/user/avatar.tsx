import type { ComponentProps } from "react";
import { useUser } from "../../../utils/api/queries";
import { cn } from "@/lib/utils";
import type { TypeUser } from "@/design/types/user";

export default function UserAvatar({
    className,
    userData,
    ...props
}: {
    className?: string,
    userData?: TypeUser
} & ComponentProps<'div'>
) {
    const query = useUser();
    const user = userData ?? query.data?.user;
    const profilePicture = user?.profilePicture;

    if (profilePicture) return (
        <div className={cn("w-10 h-10", className)} {...props}>
            <img
                className="w-full object-cover rounded-lg"
                src={`${import.meta.env.VITE_S3_URL}profilePictures/${profilePicture}`}
            />

        </div>
    )
    const letter = user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : "?";

    return (
        <div className={cn("w-10 h-10 text-xs rounded-lg bg-green-500/50 text-white flex items-center justify-center", className)} {...props}>
            {letter}
        </div>
    );
}
