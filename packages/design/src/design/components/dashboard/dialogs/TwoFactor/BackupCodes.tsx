import { Dialog, DialogContent } from "@/components/ui/dialog";
import { create } from "zustand";

export const useBackupCodesStore = create<{
    isOpen: boolean;
    backupCodes: string[];
    setIsOpen: (open: boolean) => void;
    setBackupCodes: (codes: string[]) => void;
}>((set) => ({
    isOpen: false,
    backupCodes: [],
    setIsOpen: (open) => set({ isOpen: open }),
    setBackupCodes: (codes) => set({ backupCodes: codes })
}));

export default function BackupCodes() {
    const { isOpen, backupCodes, setIsOpen } = useBackupCodesStore();
    const downloadcodes = () => {
        const text = backupCodes.join("\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url
        a.download = `${import.meta.env.VITE_APP_NAME}_backup_codes.txt`
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url)
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
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
                            disabled={backupCodes.length != 6}
                            className="py-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-green-500 disabled:cursor-not-allowed px-4 max-w-min rounded-lg bg-green-500 border-b-6 border-gray-400/50 hover:translate-y-0.5 hover:bg-green-600 text-white cursor-pointer font-semibold transition">
                            Download
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}