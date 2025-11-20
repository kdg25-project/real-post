import { Input } from "@/components/ui/input"

interface TextFormProps {
    label: string;
    type?: string;
    placeholder?: string;
}

export default function TextForm({ label, type = "text", placeholder = "" }: TextFormProps) {
    return (
        <div className="flex flex-col gap-[12px]">
            <label htmlFor="" className="text-[16px] font-bold">{label}</label>
            <Input type={type} placeholder={placeholder} />
        </div>
    )
}