export default function CTA() {
    return (
        <div className="border-y border-[#363738] bg-black/30">
            <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Build Your Portfolio?</h2>
                <p className="text-xl text-muted-foreground mb-10 text-balance leading-relaxed">
                    Start showcasing your work with our easy-to-use portfolio builder. No coding skills required!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => {
                            window.location.href = import.meta.env.VITE_DESIGN_DOMAIN + "/auth/register";
                        }}
                        className="cursor-pointer relative font-semibold px-6 py-3 text-center transition-all rounded-full bg-green-500 text-black w-full sm:w-auto">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    )
}