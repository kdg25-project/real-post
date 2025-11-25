import Image from "next/image";
import Link from "next/link";

type Props = {
  companyId: string;
  imageUrl?: string;
};

export default function GoodsCard({ companyId, imageUrl }: Props) {
  return (
    <Link href={`/user/company/${companyId}`} className="flex flex-col gap-[6px] w-fit">
      <div className="relative w-[160px] h-[160px] bg-white rounded-[15px] overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No Image
          </div>
        )}
      </div>
    </Link>
  );
}
