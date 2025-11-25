import { Check } from "lucide-react";

export default function CompletionPage() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-1/2 w-[354px] h-auto bg-white rounded-[15px] shadow-base text-center p-[42px]">
      <div className="flex items-center justify-center w-[52px] h-[52px] bg-primary rounded-full shadow-base text-white mx-auto">
        <Check size={24} />
      </div>
      <p className="font-[16px] text-center mt-[24px]">
        Thank you very much for completing our survey. Your feedback will help us improve our
        service.
      </p>
    </div>
  );
}
