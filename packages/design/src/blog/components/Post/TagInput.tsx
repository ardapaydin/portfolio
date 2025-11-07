import { X } from "lucide-react";
import React, { useState } from "react";


export default function TagInput({ value, onChange }: {
    value: string[];
    onChange: (tags: string[]) => void;
}) {
    const [input, setInput] = useState("");

    const addTag = (raw: string) => {
        const tag = raw.trim();
        if (!tag) return;
        if (value.includes(tag)) { setInput(""); return; }
        onChange([...value, tag]);
        setInput("");
    };

    const removeTag = (index: number) => onChange(value.filter((_, i) => i !== index));

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter" || e.key == ",") {
            e.preventDefault();
            addTag(input);
        } else if (e.key == "Backspace" && !input && value.length > 0) removeTag(value.length - 1);
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-[#313131] rounded-lg border-b-3 border-[#242323]">
                {value.map((tag, i) => (
                    <div
                        key={tag + i}
                        className="flex items-center gap-2 bg-[#3b3a3a] text-white px-3 py-0.5 rounded text-sm"
                    >
                        <span>{tag}</span>
                        <button
                            onClick={() => removeTag(i)}
                            className="text-xs cursor-pointer opacity-70 transition-all hover:opacity-100"
                        >
                            <X className="w-4" />
                        </button>
                    </div>
                ))}

                <input
                    className="flex-1 text-white focus:outline-none px-1 py-1"
                    value={input}
                    placeholder={"Add tag and press Enter"}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={() => addTag(input)}
                />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Press Enter or comma to add. Backspace removes last tag.</p>
        </div>
    );
}