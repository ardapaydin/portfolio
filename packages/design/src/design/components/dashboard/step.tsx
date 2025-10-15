const steps = [
    {
        title: "Getting Started",
        description: "Create an portfolio"
    },
    {
        title: "Edit Portfolio",
        description: "Customize your portfolio"
    },
    {
        title: "Publish",
        description: "Make your portfolio live"
    }
]

export default function Step() {
    const userStep = 0 // todo: get from api
    if (userStep >= steps.length) return null;
    return (
        <div className="px-6 py-4 border-b border-[#333] transition-all duration-200">
            <div>
                <div className="text-yellow-400 text-sm mb-1">{steps[userStep].title}</div>
                <div className="text-[#ccc] text-xs mb-2 truncate">{steps[userStep].description}</div>
                <div className="flex gap-2 items-center mb-2">
                    <div className="h-3 w-full bg-[#222] rounded-lg">
                        <div
                            className="h-3 bg-[#4F8CFF] rounded-lg transition-all duration-500"
                            style={{ width: `${((userStep) / steps.length) * 100}%` }}
                        />
                    </div>
                    <div className="text-[#ccc] text-xs">
                        {userStep}/{steps.length}
                    </div>

                </div>
            </div>
        </div>
    )
}