import Loading from "@/design/components/loading";
import { ChangePassword } from "@/utils/api/auth";
import { useValidateResetKey } from "@/utils/api/queries";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const validate = (form: { [key: string]: string }) => {
    const errors: { [key: string]: string[] } = {};
    if (!form.password) errors.password = ["Password is required."];
    else if (form.password.length < 6) errors.password = ["Password must be at least 6 characters."];
    else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(form.password)
    ) errors.password = [
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ];
    if ((form.password && form.confirmPassword) && form.password !== form.confirmPassword) errors.confirmPassword = ["Passwords do not match."];
    return errors;
};

export default function ResetPassword() {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const [form, setForm] = useState({
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        setErrors({});
        if (!form.password) return;
        const validationErrors = validate(form);
        setErrors(validationErrors);
    }, [form]);


    if (!token) return <Navigate to={"/"} replace />
    const submit = async () => {
        const res = await ChangePassword(token, form.password);
        if (res?.data?.success) window.location.href = "/auth/login?reset=true"
        else setErrors(res.data?.errors || res.data?.message || "unknown error")
    }

    const r = useValidateResetKey(token);
    if (r.isLoading) return <Loading />
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-[#222222]/50 p-4 rounded-md w-lg flex flex-col items-center border-2 shadow-lg border-[#303030]/50">
                {!r.data?.valid && (
                    <>
                        <div className="bg-red-500/50 mt-8 rounded">
                            <X className="w-12 h-12" />
                        </div>

                        <div className="text-center my-8">
                            <p>The reset link is invalid or has expired.</p>
                        </div>
                    </>
                ) || (
                        <div className="flex flex-col gap-6 w-full p-3">
                            <div className="flex flex-col gap-4 text-left">
                                <label className="mb-1 text-sm font-medium text-gray-200">
                                    New Password
                                </label>
                                {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="px-4 py-3 rounded-lg bg-[#313131] border-b-3 border-[#242323] text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <label className="mb-1 text-sm font-medium text-gray-200">
                                    Confirm Password
                                </label>
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword[0]}</p>}
                                <input
                                    id="cpassword"
                                    type="password"
                                    name="cpassword"
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="px-4 py-3 rounded-lg bg-[#313131] border-b-3 border-[#242323] text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                                />
                            </div>

                            <button
                                onClick={submit}
                                disabled={Object.keys(errors).length > 0 || !form.confirmPassword || !form.password}
                                className="mt-4 w-full disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed py-2 rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                            >
                                Reset Password
                            </button>

                        </div>
                    )}
            </div>
            <div className="absolute inset-0 -z-10 h-full w-full opacity-20 bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:16px_16px]" />

        </div>
    )
}