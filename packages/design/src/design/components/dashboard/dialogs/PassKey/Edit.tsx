import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { TypeDevice } from "@/design/types/device";
import { UpdatePasskey } from "@/utils/api/passkey";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function EditPasskey({ children, device }: { children: React.ReactNode, device: TypeDevice }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(device.name);

    const qc = useQueryClient();
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const submit = async () => {
        const update = await UpdatePasskey(device.id, name)

        if (update.status === 200) {
            setIsOpen(false);
            qc.setQueryData(["user"], (old: any) => {
                const devices = old.devices.map((d: TypeDevice) => d.id === device.id ? { ...d, name } : d);
                return {
                    ...old,
                    devices
                }
            });
        } else setErrors(update.data?.errors || { name: ["Internal server error."] })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Update Security Key</h2>
                    <div className="flex flex-col gap-2">
                        {errors.name && <p className="text-sm text-red-400">{errors.name[0]}</p>}
                        <input type="text" className="p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none" value={name} onChange={(e) => {
                            setErrors({})
                            setName(e.target.value)
                        }} />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => submit()}
                        disabled={!name.trim() || name.length >= 50 || name == device.name}
                        className="mt-4 py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                        Update
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    )
}