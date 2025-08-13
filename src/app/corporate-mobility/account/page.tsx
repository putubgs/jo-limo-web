import Image from "next/image";

export default function Account() {
  return (
    <div className="w-3/4 flex flex-col">
      <div className="flex w-full rounded-lg border">
        <div className="w-1/4 bg-[#F2F2F2] p-10 items-center ">
          <Image
            src="/images/luxury.png"
            alt="Luxury Vehicle"
            width={225}
            height={181}
          />
        </div>
        <div className="flex flex-col w-3/4 px-8 py-6 justify-between">
          <div className="flex flex-col gap-2 text-[15px]">
            <p className="font-bold">Wed, AUG 7, 2024 at 10.45 AM</p>
            <div>
              <p>
                From&nbsp;&nbsp;: DAMAC Tower, Al-Istethmar Street, Amman,
                Jordan
              </p>
              <p className="-mt-1">
                To&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Queen Alia Airport
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between items-center border-t border-1 pt-1">
            <p className="text-[16px] font-bold">JOD60.500</p>
            <div className="flex gap-3 text-[#B2B2B2] text-[12px]">
              <p className="underline cursor-pointer">Invoice</p>
              <p className="underline cursor-pointer">Detail</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
