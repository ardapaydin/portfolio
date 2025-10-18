import UserAvatar from "@/design/components/user/avatar";
import { useUser } from "../../../utils/api/queries";
import Layout from "../../components/dashboard/layout";
import { Mail, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { UpdateUser } from "@/utils/api/user";

export default function Settings() {
    const user = useUser();
    const [form, setForm] = useState({
        name: user?.data?.user?.name,
        email: user?.data?.user?.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        const newErrors: { [key: string]: string[] } = {};
        if (form.name && form.name.length > 60) newErrors.name = ["Name is so long."]
        if (form.name && form.name.length < 2) newErrors.name = ["Name is so short."]
        if (!form.email?.trim()) newErrors.email = ["Email is required."];
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) newErrors.email = ["Email is invalid."];

        if (form.newPassword) {
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(form.newPassword)) newErrors.newPassword = ["Password must be at least 6 characters, include uppercase, lowercase, number, and special character."];
            if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = ["Passwords do not match."];
        }

        if (form.newPassword && !form.currentPassword) newErrors.currentPassword = ["Please enter your current password to change your password."];

        setErrors(newErrors);
    }, [form]);

    const submit = async () => {
        if (!form.name || !form.email) return;
        const request = await UpdateUser(form.name, form.email, form.currentPassword, form.newPassword);
        if (request.status == 200) window.location.reload();
        else setErrors(request.data?.errors || request.data?.message)
    }

    return (
        <Layout>
            <div className="flex-1 h-full md:px-64">
                <div className="flex gap-6 items-center">
                    <UserAvatar className="w-24 h-24 text-2xl" />
                    <div className="flex flex-col mt-1">
                        <h1 className="text-sm">
                            Profile Picture
                        </h1>
                        <p className="text-muted-foreground text-xs">
                            Recommended size 256x256
                        </p>
                        <div className="border-2 flex mt-3 text-sm cursor-not-allowed opacity-50 items-center justify-center gap-2 border-muted-foreground p-1 px-4 rounded-lg">
                            <Upload className="w-4" />
                            Upload Picture
                        </div>
                    </div>
                </div>
                {typeof errors == "string" && <p className="text-red-500 text-sm">{errors}</p>}
                <div className="flex flex-col mt-8 gap-4">
                    <div className="flex flex-col gap-1">

                        <label className="text-white/50">Full Name</label>
                        {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}

                        <input type="text" className="p-2 px-4 rounded-lg bg-[#333] border-2 border-[#3f3e3e] focus:outline-none" value={form.name} onChange={(e) => {
                            setForm({ ...form, name: e.target.value })
                        }} />

                    </div>
                    <div className="flex flex-col gap-1">

                        <label className="text-white/50">Email</label>
                        {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}

                        <div className="flex bg-[#333] border-2 p-2 gap-2 px-3 rounded-lg border-[#3f3e3e] items-center">
                            <div className="bg-[#111]/50 w-6 h-6 flex items-center justify-center rounded">
                                <Mail className="w-4" />
                            </div>

                            <input type="text" className="focus:outline-none w-full" value={form.email} onChange={(e) => {
                                setForm({ ...form, email: e.target.value })
                            }} />
                        </div>

                    </div>
                </div>

                <div className="flex flex-col mt-8 gap-4">
                    <h1 className="text-xl">
                        Password Change
                    </h1>
                    <div className="flex flex-col gap-1">

                        <label className="text-white/50">Current Password</label>
                        {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword[0]}</p>}

                        <input type="password" placeholder="Add current password" className="p-2 px-4 rounded-lg placeholder:text-muted-foreground bg-[#333] border-2 border-[#3f3e3e] focus:outline-none" value={form.currentPassword} onChange={(e) => {
                            setForm({ ...form, currentPassword: e.target.value })
                        }} />

                    </div>
                    <div className="flex flex-col gap-1">

                        <label className="text-white/50">New Password</label>
                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword[0]}</p>}

                        <input type="password" className="p-2 px-4 rounded-lg bg-[#333] border-2 border-[#3f3e3e] focus:outline-none" value={form.newPassword} onChange={(e) => {
                            setForm({ ...form, newPassword: e.target.value })
                        }} />

                    </div>
                    <div className="flex flex-col gap-1">

                        <label className="text-white/50">Confirm New Password</label>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword[0]}</p>}
                        <input type="password" className="p-2 px-4 rounded-lg bg-[#333] border-2 border-[#3f3e3e] focus:outline-none" value={form.confirmPassword} onChange={(e) => {
                            setForm({ ...form, confirmPassword: e.target.value })
                        }} />

                    </div>

                </div>

                <div className="flex bg-[#222222] w-full p-2 mt-8 shadow-2xl rounded-lg justify-end">
                    <button
                        onClick={submit}
                        disabled={!!Object.keys(errors).length}
                        className="border-2 border-[#3f3e3e] p-2 disabled:opacity-50 rounded-full px-4 py-1 cursor-pointer hover:bg-[#333] transition bg-[#333]/50">
                        Save
                    </button>
                </div>
            </div>
        </Layout>
    )
}