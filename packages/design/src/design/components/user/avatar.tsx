import { useUser } from "../../../utils/api/queries";

export default function UserAvatar() {
    const user = useUser();
    const letter = user.data?.user?.name ? user.data.user.name.charAt(0).toUpperCase() : user.data?.user?.email ? user.data.user.email.charAt(0).toUpperCase() : "?";

    return (
        <div className="w-10 h-10 text-xs rounded-full bg-green-500/50 text-white flex items-center justify-center">
            {letter}
        </div>
    );
}
