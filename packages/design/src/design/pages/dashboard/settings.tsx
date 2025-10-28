import UserAvatar from "@/design/components/user/avatar";
import { useUser } from "../../../utils/api/queries";
import Layout from "../../components/dashboard/layout";
import { Mail, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UpdateUser } from "@/utils/api/user";
import { UploadProfilePicture } from "@/utils/api/attachments";
import { useQueryClient } from "@tanstack/react-query";
import type { TypeUser } from "@/design/types/user";
import DeleteAccount from "@/design/components/dashboard/dialogs/DeleteAccount";
import SetupTwoFactor from "@/design/components/dashboard/dialogs/TwoFactor/Setup";
import { useTwoFactorStore } from "@/store/twoFactorStore";
import BackupCodes from "@/design/components/dashboard/dialogs/TwoFactor/BackupCodes";
import { RegisterRequest, RegisterResponse } from "@/utils/api/passkey";
import { startRegistration } from "@simplewebauthn/browser"
export default function Settings() {
    const user = useUser();
    const qc = useQueryClient();
    const [form, setForm] = useState({
        name: user?.data?.user?.name,
        email: user?.data?.user?.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setIsOpen, setData } = useTwoFactorStore()
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

    const fileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(file)
        if (!file) return;
        const formdata = new FormData();
        formdata.append("file", file)
        const r = await UploadProfilePicture(formdata)
        if (r.data.success) {
            const d = qc.getQueryData(["user"]) as { user: TypeUser };
            qc.setQueryData(["user"], {
                ...d,
                user: {
                    ...d.user,
                    profilePicture: r.data.id
                }
            })
        }
    }

    const passkey = async () => {
        const { data: options } = await RegisterRequest();

        const credential = await startRegistration(options);
        if (!credential) return;


        await RegisterResponse(credential)
    };

    return (
        <Layout>
            <div className="flex-1 h-full max-w-3xl mx-auto">
                <div className="flex gap-6 items-center">
                    <UserAvatar className="w-24 h-24 text-2xl" />
                    <div className="flex flex-col mt-1">
                        <h1 className="text-sm">
                            Profile Picture
                        </h1>
                        <p className="text-muted-foreground text-xs">
                            Recommended size 256x256
                        </p>
                        <div onClick={() => { fileInputRef.current?.click() }} className="border-2 cursor-pointer opacity-90 hover:opacity-100 transition flex mt-3 text-sm items-center justify-center gap-2 border-muted-foreground p-1 px-4 rounded-lg">
                            <Upload className="w-4" />
                            Upload Picture
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={fileChange}
                        />
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

                <div className="flex mt-8 gap-4 items-center">
                    <h1 className="text-xl">
                        Two Factor Authentication
                    </h1>

                    <div className="flex items-center gap-1">
                        <SetupTwoFactor>
                            <button
                                hidden={user.data?.twoFactor}
                                className="border-b-2 rounded text-sm border-green-500 max-w-min p-2 px-4 py-1 cursor-pointer hover:bg-green-500 transition-all bg-green-500/50"
                            >
                                Enable
                            </button>
                        </SetupTwoFactor>

                        <button
                            onClick={() => {
                                setData({
                                    type: "disableTwoFactor",
                                    fields: {},
                                    options: ["app"]
                                })
                                setIsOpen(true)
                            }}
                            hidden={!user.data?.twoFactor} className="border-b-2 rounded text-sm border-red-500 max-w-min p-2 px-4 py-1 cursor-pointer hover:bg-red-500 transition-all bg-red-500/50">
                            Disable
                        </button>

                        {user.data?.twoFactor && (
                            <>
                                <BackupCodes />
                                <button
                                    onClick={() => {
                                        setData({
                                            type: "requestBackupCodes",
                                            fields: {},
                                            options: ["app"]
                                        })
                                        setIsOpen(true)
                                    }}
                                    className="border-b-2 rounded text-sm border-blue-500 p-2 px-4 py-1 cursor-pointer hover:bg-blue-500 transition-all bg-blue-500/50">
                                    New Backup Codes
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex mt-8 gap-4 items-center">
                    <h1 className="text-xl">
                        Passkey
                    </h1>

                    <button
                        onClick={() => passkey()}
                        className="border-b-2 rounded text-sm border-green-500 max-w-min p-2 px-4 py-1 cursor-pointer hover:bg-green-500 transition-all bg-green-500/50"
                    >
                        Add
                    </button>
                </div>

                <div className="flex bg-[#222222] w-full p-2 mt-8 shadow-2xl rounded-lg justify-between">
                    <DeleteAccount>
                        <button
                            className="border-2 border-dashed rounded-full text-sm border-red-500 p-2 px-4 py-1 cursor-pointer hover:bg-red-500 transition-all bg-red-500/50"
                        >
                            Delete Account
                        </button>
                    </DeleteAccount>

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