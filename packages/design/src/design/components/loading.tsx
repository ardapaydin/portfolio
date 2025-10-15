export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex space-x-2">
                <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#0f0_100%)]" />
                <div className="absolute inset-0 -z-10 h-full w-full opacity-20 bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:16px_16px]" />

                {[...Array(5)].map((_, index) => (
                    <div key={index} className="w-2 h-8 bg-green-500 rounded animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}></div>
                ))}
            </div>
        </div>
    );
}