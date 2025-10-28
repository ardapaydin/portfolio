import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTwoFactorStore } from "@/store/twoFactorStore";
import { DeleteUser } from "@/utils/api/user";
import logout from "@/utils/auth/logout";
import { useState } from "react";

export default function DeleteAccount({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const twoFaStore = useTwoFactorStore()
    const deleteacc = async () => {
        const req = await DeleteUser(password);
        if (req.status == 200) {
            logout();
            window.location.href = "/"
        } else if (req?.data?.message == "2FA") {
            twoFaStore.setData({
                type: "deleteAccount",
                fields: { password },
                options: ["app", "backup"]
            })
            twoFaStore.setIsOpen(true)
        } else setErrors(req?.data?.errors || { password: ["Internal server error"] });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Delete Account</h1>
                    <div className="flex flex-col gap-2 mt-2 mb-2">
                        <label className="font-semibold">Password</label>
                        {errors.password && <span className="text-red-500">{errors.password[0]}</span>}
                        <input
                            type="password"
                            className="w-full p-2 px-4 rounded-lg bg-[#333] focus:outline-none"
                            value={password}
                            onChange={(e) => { setErrors({}); setPassword(e.target.value) }}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={deleteacc}
                            disabled={!password.trim() || !!Object.keys(errors).length}
                            className="py-0.5 px-2 rounded-lg bg-red-500 border-b-8 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-red-500 border-gray-400/50 hover:translate-y-0.5 hover:bg-red-600 text-white cursor-pointer font-semibold transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}