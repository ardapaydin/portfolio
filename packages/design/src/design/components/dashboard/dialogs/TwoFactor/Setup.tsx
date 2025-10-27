import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { LoadingSmall } from "@/design/components/loading";
import { Verify } from "@/utils/api/2fa";
import { useTwoFactorSetup } from "@/utils/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { useState } from "react"

export default function SetupTwoFactor({ children }: {
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false);
    const setup = useTwoFactorSetup(isOpen);
    const [code, setCode] = useState("")
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [backupCodes, setBackupCodes] = useState<string[]>([])
    const qc = useQueryClient();
    const handleverify = async () => {
        const r = await Verify(code);
        if (r.status == 200) {
            setBackupCodes(r.data.codes)
            qc.setQueryData(["user"], (old: any) => ({
                ...old,
                twoFactor: true
            }))
        } else setErrors(r.data?.errors || { code: ["Internal server error."] })
    }

    const downloadcodes = () => {
        const text = backupCodes.join("\n");
        const blob = new Blob([text], { type: "text/plain" })
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${import.meta.env.VITE_APP_NAME}_backup_codes.txt`;
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                {setup.isLoading && <LoadingSmall /> || (setup.data && !backupCodes.length) && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold">2FA Setup</h2>

                        <div className="flex flex-col items-center">
                            <img src={setup.data?.qr} draggable={false} className="w-48 h-48 bg-white p-2 rounded" />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <h3 className="text-lg font-semibold">Secret Key</h3>
                            <div className="flex">
                                <input className="w-full p-2 px-4 rounded-l-lg bg-[#333] border-2 border-r-0 border-[#3f3e3e] focus:outline-none" readOnly value={setup.data?.secret} />
                                <div
                                    onClick={() => navigator.clipboard.writeText(setup.data.secret)}
                                    className="border-2 items-center text-muted-foreground hover:text-white transition-all justify-center flex px-2 cursor-pointer border-l-0 rounded-r-lg border-[#3f3e3e] bg-[#333]">
                                    <Copy />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 flex flex-col">
                            <h3 className="text-sm text-muted-foreground">
                                Enter Code
                            </h3>
                            {errors.code && <p className="text-red-500">{errors.code[0]}</p>}
                            <input className="w-full p-2 px-4 rounded-lg bg-[#333] border-[#3f3e3e] focus:outline-none"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                pattern="[0-9]*"
                                maxLength={6}
                                placeholder="000000"
                                onKeyDown={(e) => {
                                    if (e.key == "Backspace") return;
                                    if (!/[0-9]/.test(e.key)) e.preventDefault()
                                    else setErrors({})
                                }}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleverify}
                                disabled={code.length != 6}
                                className="py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                                Verify
                            </button>
                        </div>
                    </div>
                )}

                {(!!backupCodes.length) && (
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold">
                            Backup Codes
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Save these backup codes in a secure location. You can use these codes to access your account if you lose access to your authentication device. Each code can only be used once.
                        </p>

                        <div className="grid md:grid-cols-2 gap-2 mt-4">
                            {backupCodes.map((code, index) => (
                                <div key={index} className="bg-[#333] p-2 rounded-lg text-center select-text">
                                    {code}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={downloadcodes}
                                disabled={code.length != 6}
                                className="py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                                Download
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}