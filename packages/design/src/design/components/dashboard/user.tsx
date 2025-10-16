import { useUser } from "@/utils/api/queries";
import UserAvatar from "../user/avatar";
import { LogOut } from "lucide-react";
import logout from "@/utils/auth/logout";

export default function User({ collapsed }: { collapsed: boolean }) {
    const user = useUser();
    return (
        <div className={`flex flex-col py-2 ${collapsed ? "items-center" : ""}`}>
            <div className="flex items-center">
                <UserAvatar />
                {!collapsed &&
                    <div className="flex flex-col">
                        {user.data?.user?.name ? (
                            <span className="ml-3 text-sm font-medium text-white truncate">{user.data.user.name}</span>
                        ) : null}

                        <span className="ml-3 text-xs text-white/30 truncate">{user.data?.user?.email}</span>
                    </div>
                }
            </div>

            <button
                className="mt-4 w-full py-2 flex items-center gap-2 justify-center px-4 border border-[#383838] text-[#636363] text-sm font-medium rounded-lg transition hover:bg-[#262626] hover:border-green-500 hover:border-dashed cursor-pointer hover:text-green-500"
                onClick={() => {
                    logout();
                    window.location.reload();
                }}
            >
                {!collapsed && "Logout"}
                <LogOut className="w-4" />
            </button>
        </div>
    )
}