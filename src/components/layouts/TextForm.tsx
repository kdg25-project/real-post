"use clinet";

interface TextFormProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

export default function TextForm({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  readOnly,
}: TextFormProps) {
  return (
    <div className="flex flex-col gap-[12px] m-0">
      <label htmlFor="" className="text-[16px] font-bold">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        className="w-full px-[20px] py-[15px] rounded-[14px] bg-white shadow-base focus:outline-none"
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
}
