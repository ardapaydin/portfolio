import Navbar from "@/components/Landing/Navbar";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            <div className="flex-1 flex flex-col items-center justify-center text-white">
                <h1 className="text-8xl font-bold mb-4">404</h1>
                <p className="text-2xl mb-8">
                    Oops! The page you're looking for doesn't exist...
                </p>
                <a href="/" className="border border-green-500 font-bold text-green-500 px-6 py-3 rounded-full hover:bg-green-500 hover:text-black transition">
                    Go back to Home
                </a>
            </div>
        </div>
    )
}