import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { TypeDevice } from "@/design/types/device"
import { useTwoFactorStore } from "@/store/twoFactorStore";
import { DeletePasskey } from "@/utils/api/passkey"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react";

export default function DeletePasskeyDialog({ children, id }: { children: React.ReactNode, id: string }) {
    const qc = useQueryClient();
    const [error, setError] = useState(false)
    const [confirm, setConfirm] = useState("")
    const { setData, setIsOpen } = useTwoFactorStore();
    const deletepasskey = async () => {
        const re = await DeletePasskey(id)
        if (re.status == 200) {
            qc.setQueryData(["user"], (old: { devices: TypeDevice[] }) => {
                return {
                    ...old,
                    devices: old.devices.filter(x => x.id != id)
                }
            })
        } else if (re?.data?.message == "2FA") {
            setData({
                type: "deletePasskey",
                fields: {},
                mfa: re.data.mfa,
                options: [],
                function: deletepasskey
            })
            setIsOpen(true);
        } else setError(true)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Delete Security Key</h1>
                    {error && <span className="text-red-500">An unknown error occured.</span>}

                    <div className="flex flex-col gap-2 mt-4 mb-2">
                        <input
                            type="text"
                            className="w-full p-2 px-4 rounded-lg bg-[#333] focus:outline-none"
                            value={confirm}
                            placeholder="CONFIRM or confirm or CoNfIrm"
                            onChange={(e) => setConfirm(e.target.value)}
                        />

                    </div>

                    <div className="text-xs text-white/50">
                        Write <span className="text-red-300 font-mono">confirm</span> to delete portfolio.
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={deletepasskey}
                            disabled={confirm.toLowerCase() != "confirm"}
                            className="py-0.5 px-2 rounded-lg bg-red-500 border-b-8 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-red-500 border-gray-400/50 hover:translate-y-0.5 hover:bg-red-600 text-white cursor-pointer font-semibold transition"
                        >
                            Delete Security Key
                        </button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}