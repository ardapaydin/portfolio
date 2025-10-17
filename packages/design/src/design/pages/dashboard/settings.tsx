import UserAvatar from "@/design/components/user/avatar";
import { useUser } from "../../../utils/api/queries";
import Layout from "../../components/dashboard/layout";
import { Mail, Upload } from "lucide-react";
import { useState } from "react";

export default function Settings() {
    const user = useUser();
    const [form, setForm] = useState({
        name: user?.data?.user?.name,
        email: user?.data?.user?.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
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

                <div className="flex flex-col mt-8 gap-4">
                    <div className="flex flex-col gap-1">

                        <label className="text-white/50">Full Name</label>
                        <input type="text" className="p-2 px-4 rounded-lg bg-[#333] border-2 border-[#3f3e3e] focus:outline-none" value={form.name} onChange={(e) => {
                            setErrors({})
                            setForm({ ...form, name: e.target.value })
                        }} />

                    </div>
                    <div className="flex flex-col gap-1">

                        <label className="text-white/50">Email</label>
                        <div className="flex bg-[#333] border-2 p-2 gap-2 px-3 rounded-lg border-[#3f3e3e] items-center">
                            <div className="bg-[#111]/50 w-6 h-6 flex items-center justify-center rounded">
                                <Mail className="w-4" />
                            </div>
                            <input type="text" className="focus:outline-none z-10" value={form.email} onChange={(e) => {
                                setErrors({})
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
                        <input type="text" placeholder="Add current password" className="p-2 px-4 rounded-lg placeholder:text-muted-foreground bg-[#333] border-2 border-[#3f3e3e] focus:outline-none" value={form.currentPassword} onChange={(e) => {
                            setErrors({})
                            setForm({ ...form, currentPassword: e.target.value })
                        }} />

                    </div>
                    <div className="flex flex-col gap-1">

                        <label className="text-white/50">New Password</label>
                        <input type="text" className="p-2 px-4 rounded-lg bg-[#333] border-2 border-[#3f3e3e] focus:outline-none" value={form.newPassword} onChange={(e) => {
                            setErrors({})
                            setForm({ ...form, newPassword: e.target.value })
                        }} />

                    </div>
                    <div className="flex flex-col gap-1">

                        <label className="text-white/50">Confirm New Password</label>
                        <input type="text" className="p-2 px-4 rounded-lg bg-[#333] border-2 border-[#3f3e3e] focus:outline-none" value={form.confirmPassword} onChange={(e) => {
                            setErrors({})
                            setForm({ ...form, confirmPassword: e.target.value })
                        }} />

                    </div>

                </div>

                <div className="flex bg-[#222222] w-full p-2 mt-8 shadow-2xl rounded-lg justify-end">
                    <div className="border-2 border-[#3f3e3e] p-2 rounded-full px-4 py-1 cursor-pointer hover:bg-[#333] transition bg-[#333]/50">
                        Save
                    </div>
                </div>
            </div>
        </Layout>
    )
}