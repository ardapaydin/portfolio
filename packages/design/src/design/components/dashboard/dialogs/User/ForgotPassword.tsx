import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RequestKey } from "@/utils/api/auth";
import { Check } from "lucide-react";
import { useEffect, useState } from "react"



export default function ForgotPassword({ children }: {
    children: React.ReactNode
}) {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [isSent, setIsSent] = useState(false);
    useEffect(() => {
        if (!email) return setErrors({});
        if (!email.trim()) setErrors({ email: ["Email is required."] });
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) setErrors({ email: ["Email is invalid."] });
        else setErrors({});
    }, [email])

    const submit = async () => {
        const r = await RequestKey(email);
        if (r.data?.errors) setErrors(r.data.errors)
        if (r.status == 200) setIsSent(true)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex flex-col">
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                </DialogHeader>
                {(isSent) && (
                    <div className="space-y-2 items-center flex flex-col">
                        <div className="bg-green-500/50 rounded">
                            <Check className="h-12 w-12" />
                        </div>

                        <h1 className="font-bold">Password Reset Link Sent</h1>
                        <p className="text-xs text-center text-white/50">
                            We've emailed you a link to reset your password.<br />
                            Please check your inbox and follow the instructions.
                        </p>
                    </div>
                ) || (
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-200">
                                Email
                            </label>
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="px-4 py-3 rounded-lg bg-[#313131] border-b-3 border-[#242323] text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                            />


                            <button onClick={submit} disabled={Object.keys(errors).length > 0 || !email} className="mt-4 w-full disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed py-2 rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                                Request Key
                            </button>
                        </div>
                    )}
            </DialogContent>
        </Dialog>
    )
}