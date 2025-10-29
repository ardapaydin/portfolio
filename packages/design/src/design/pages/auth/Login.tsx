import { useEffect, useState } from "react";
import { LoginUser } from "../../../utils/api/auth";
import { setToken } from "../../utils/user";
import ForgotPassword from "@/design/components/dashboard/dialogs/ForgotPassword";
import { useTwoFactorStore } from "@/store/twoFactorStore";

const validate = (form: { [key: string]: string }) => {
    const errors: { [key: string]: string[] } = {};
    if (!form.email.trim()) errors.email = ["Email is required."];
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) errors.email = ["Email is invalid."];
    if (!form.password) errors.password = ["Password is required."];
    else if (form.password.length < 6) errors.password = ["Password must be at least 6 characters."];
    else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(form.password)
    ) errors.password = [
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ];
    return errors;
};

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const { registered, redirect, verified, reset } = Object.fromEntries(new URLSearchParams(window.location.search))
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const useStoreTwoFa = useTwoFactorStore()
    const request = async () => {
        const response = await LoginUser(form.email, form.password)
        if (response?.data?.success) {
            setToken(response.data.data.token);
            window.location.href = redirect || "/";
        }
        else {
            if (response.data.message == "2FA") {
                useStoreTwoFa.setData({
                    type: "login",
                    fields: { ...form, redirect },
                    options: ["app", "backup"],
                    mfa: response.data.mfa,
                    function: request
                })
                useStoreTwoFa.setIsOpen(true);
                return;
            }
            setErrors(response?.data.errors || {})
        }
    }

    useEffect(() => {
        setErrors({});
        if (!form.email && !form.password) return;
        const validationErrors = validate(form);
        setErrors(validationErrors);
    }, [form]);

    return (
        <div className="flex flex-1">
            <div className="w-full md:w-2/5 flex items-center justify-center bg-[#242424]/50 backdrop-blur-sm">
                <div className="w-full max-w-md mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <h2 className="text-3xl font-bold mb-6 text-white text-center">
                        Login to Your Account
                    </h2>
                    {registered === "true" && <p className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-6 text-center">
                        We sent you a confirmation email. Please check your inbox to confirm your account.
                    </p>}

                    {verified === "true" && <p className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-6 text-center">
                        Your email has been verified. You can now log in.
                    </p>}
                    {reset === "true" && (
                        <p className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-6 text-center">
                            Your password has been reset. You can now log in with your new password.
                        </p>
                    )}

                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col text-left">
                            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-200">Email</label>
                            {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="px-4 py-3 rounded-lg bg-[#313131] border-b-3 border-[#242323] text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                            />
                        </div>
                        <div className="flex flex-col text-left">
                            <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-200">Password</label>
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
                        <button
                            onClick={request}
                            disabled={Object.keys(errors).length > 0 || !form.email || !form.password}
                            className="mt-4 w-full disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed py-2 rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition"
                        >
                            Login
                        </button>
                        <div className="items-end justify-end flex text-sm -mb-2 -mt-4">
                            <ForgotPassword>
                                <span className="text-green-400 cursor-pointer">
                                    Forgot Password?
                                </span>
                            </ForgotPassword>
                        </div>
                        <p className="text-sm text-gray-400 text-center">
                            Don't have an account? <a href="/auth/register" className="text-green-400 hover:underline">Sign up</a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="md:w-full h-screen bg-green-500/20">
                <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#0f0_100%)]" />
                <div className="absolute inset-0 -z-10 h-full w-full opacity-20 bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
        </div>
    )
}