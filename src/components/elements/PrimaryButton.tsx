interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
}

export default function PrimaryButton({ text, onClick }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full h-[62px] bg-primary text-[20px] font-medium text-white rounded-[15px]"
    >
      {text}
    </button>
  );
}
