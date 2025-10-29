import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RegisterResponse } from "@/utils/api/passkey";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { create } from "zustand";

export const usePasskeyNameStore = create<{
    isOpen: boolean;
    attestationResponse: object;
    setIsOpen: (open: boolean) => void;
    setAttestationResponse: (codes: object) => void;
}>((set) => ({
    isOpen: false,
    attestationResponse: {},
    setIsOpen: (open) => set({ isOpen: open }),
    setAttestationResponse: (codes) => set({ attestationResponse: codes })
}));

export default function PassKeyName() {
    const { isOpen, setIsOpen, attestationResponse } = usePasskeyNameStore()
    const [name, setName] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
    const qc = useQueryClient();
    const submit = async () => {
        const req = await RegisterResponse(attestationResponse, name)
        if (req.status == 200) {
            setIsOpen(false);
            setName("");

            qc.setQueryData(["user"], (old: any) => {
                return {
                    ...old,
                    devices: [req.data.device, ...old.devices]
                }
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Set Security Key Name</h2>
                    <div className="flex flex-col gap-2">
                        {errors.name && <p className="text-sm text-red-400">{errors.name[0]}</p>}
                        <input type="text" className="p-2 rounded-lg bg-[#333] border border-[#333] focus:outline-none" value={name} onChange={(e) => {
                            setErrors({})
                            setName(e.target.value)
                        }} />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => submit()}
                            disabled={!name.trim() || name.length >= 50}
                            className="mt-4 py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                            Submit
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}