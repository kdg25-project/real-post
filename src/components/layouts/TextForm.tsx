'use clinet'

interface TextFormProps {
    label: string;
    type?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextForm({ label, type = "text", placeholder = "", onChange }: TextFormProps) {
    return (
        <div className="flex flex-col gap-[12px] m-0">
            <label htmlFor="" className="text-[16px] font-bold">{label}</label>
            {/* <Input type={type} placeholder={placeholder} /> */}
            <input
                type={type}
                placeholder={placeholder}
                className="w-full px-[20px] py-[15px] rounded-[14px] bg-white shadow-base focus:outline-none"
                onChange={onChange}
            />
        </div>
    )
}