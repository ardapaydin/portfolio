export default function Footer() {
    return (
        <footer className="border-t border-[#363738] bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-primary" />
                        <span className="font-semibold">
                            {import.meta.env.VITE_APP_NAME}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}