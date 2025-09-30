import Image from "next/image";

interface HistoryCardProps {
  image: string;
  imageName: string;
  dateTime: string;
  pickup: string;
  dropoff: string;
  price: string;
  onDetailClick?: () => void;
}

export default function HistoryCard({
  image,
  imageName,
  dateTime,
  pickup,
  dropoff,
  price,
  onDetailClick,
}: HistoryCardProps) {
  return (
    <div className="flex w-full rounded-lg border border-[#F2F2F2] md:h-[181px]">
      <div className="md:w-1/4 w-1/2 bg-[#F2F2F2] md:p-10 p-3 items-center flex justify-center">
        <Image src={image} alt={imageName} width={225} height={181} />
      </div>
      <div className="flex flex-col w-3/4 md:px-8 px-2 md:py-6 py-4 justify-between">
        <div className="flex flex-col gap-2 md:text-[15px] text-[13px]">
          <p className="font-bold">{dateTime}</p>
          <div>
            <p>From&nbsp;&nbsp;: {pickup}</p>
            <p className="md:-mt-1 mt-1">
              To&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {dropoff}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between items-center border-t border-1 pt-1">
          <p className="md:text-[16px] text-[14px] font-bold">{price}</p>
          <div className="flex gap-3 text-[#B2B2B2] text-[12px]">
            {/* <p className="underline cursor-pointer">Invoice</p> */}
            <p
              className="underline cursor-pointer hover:text-gray-600"
              onClick={onDetailClick}
            >
              Detail
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
