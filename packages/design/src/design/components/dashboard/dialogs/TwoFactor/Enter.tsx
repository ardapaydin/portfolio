import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { setToken } from "@/design/utils/user"
import { useTwoFactorStore } from "@/store/twoFactorStore"
import { BackupCodes, Disable } from "@/utils/api/2fa"
import { LoginUser } from "@/utils/api/auth"
import { useQueryClient } from "@tanstack/react-query"
import { Lock } from "lucide-react"
import { useState } from "react"
import { useBackupCodesStore } from "./BackupCodes"
import { DeleteUser } from "@/utils/api/user"
import logout from "@/utils/auth/logout"
import { deletePortfolio } from "@/utils/api/portfolio"
import type { TypePortfolio } from "@/design/types/portfolio"

export default function EnterTwoFACode({ children }: {
    children: React.ReactNode
}) {
    const { setIsOpen, isOpen, data } = useTwoFactorStore()
    const [type, setType] = useState("app");
    const [code, setCode] = useState("");
    const [errors, setErrors] = useState<Record<string, any>>()
    const qc = useQueryClient();
    const validate = () => {
        if (type === "app") return code.length === 6;
        if (type === "backup") return code.trim().length === 14;
        return false;
    }
    const useBcodesStore = useBackupCodesStore()
    const send = async () => {
        if (data.type == "disableTwoFactor") {
            const r = await Disable(code);
            if (r.status == 200) {
                setIsOpen(false)
                qc.setQueryData(["user"], (old: any) => ({
                    ...old,
                    twoFactor: false
                }))
            }
            else setErrors(r?.data?.errors || { code: ["Internal server error"] })
        }
        if (data.type == "login") {
            const r = await LoginUser(data.fields!.email, data.fields!.password, type, code)
            if (r.status == 200) {
                setIsOpen(false);
                setToken(r.data.data.token)
                window.location.href = data.fields!.redirect || "/";
            } else setErrors(r?.data?.errors || { code: ["Internal server error"] })
        }

        if (data.type == "requestBackupCodes") {
            const r = await BackupCodes(code, type);
            if (r.status == 200) {
                useBcodesStore.setBackupCodes(r.data.codes);
                useBcodesStore.setIsOpen(true)
                setIsOpen(false);
            } else setErrors(r?.data?.errors || { code: ["Internal server error"] })
        }

        if (data.type == "deleteAccount") {
            const r = await DeleteUser(data.fields!.password, type, code);
            if (r.status == 200) {
                logout();
                setIsOpen(false);
                window.location.href = "/"
            } else setErrors(r?.data?.errors || { code: ["Internal server error"] })
        }

        if (data.type == "deletePortfolio") {
            const r = await deletePortfolio(data.fields!.id, code, type)
            if (r.status == 200) {
                const filter = qc.getQueryData(["portfolios"]) as TypePortfolio[];
                setIsOpen(false);
                qc.setQueryData(["portfolios"], filter.filter(x => x.id != data.fields!.id))
            } else setErrors(r?.data?.errors || { code: ["Internal server error"] })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex flex-col">
                <DialogHeader>
                    <div className="flex flex-col items-center justify-center select-none gap-4">
                        <Lock size={64} />

                        <h1 className="text-2xl font-semibold">
                            Two Factor Authentication
                        </h1>
                    </div>
                </DialogHeader>
                <div className="flex flex-col">
                    {errors?.code?.[0] && <p className="text-red-500">{errors.code[0]}</p>}
                    <div className="flex gap-4 items-center justify-center mt-4">
                        {type === "app" && Array.from({ length: 6 }, (_, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                autoComplete={index === 0 ? "one-time-code" : undefined}
                                pattern="[0-9]"
                                onChange={(e) => {
                                    setErrors({})
                                    const value = e.target.value;
                                    const inputs = e.target.closest('.flex')?.querySelectorAll('input');
                                    if (value.match(/^[0-9]$/) && inputs) {
                                        if (index < 5) inputs[index + 1].focus();
                                        setCode([...inputs].map(input => input.value).join(''));
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Backspace") {
                                        e.preventDefault();
                                        const inputs = (e.target as HTMLInputElement).closest('.flex')?.querySelectorAll('input');
                                        if (inputs) {
                                            (e.target as HTMLInputElement).value = '';
                                            if (index > 0) inputs[index - 1].focus();
                                            setCode([...inputs].map(input => (input as HTMLInputElement).value).join(''));
                                        }
                                    }
                                }}
                                className="w-12 h-12 border rounded-lg text-center bg-[#333] border-[#3f3e3e] focus:outline-none"
                            />
                        ))}

                        {type === "backup" && <div className="px-4 w-full">
                            <input
                                type="text"
                                placeholder="xxxx-xxxx-xxxx-xxxx"
                                className="w-full h-12 px-4 text-xl bg-[#333] rounded-lg border-[#3f3e3e] focus:outline-none"
                                autoComplete="one-time-code"
                                onChange={e => {
                                    setErrors({})
                                    const value = e.target.value
                                        .replace(/[^0-9a-zA-Z]/g, '')
                                        .slice(0, 12)
                                        .match(/.{1,4}/g)?.join('-') || '';
                                    e.target.value = value;
                                    setCode(value);
                                }}
                            />
                        </div>}
                    </div>
                </div>
                {data.options?.includes("backup") &&
                    <div className="flex px-4 mt-4">
                        <p onClick={() => {
                            setType(type == "app" ? "backup" : "app")
                        }} className="text-sm text-green-500 font-semibold w-full hover:cursor-pointer">
                            {type === "app" ? "Use a backup code" : "Use the authenticator app"}
                        </p>
                    </div>
                }

                <div className="flex justify-end">
                    <button
                        onClick={send}
                        disabled={!validate()}
                        className="py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                        Submit
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}