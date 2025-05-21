import Image from "next/image";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function AppBanner() {
  return (
    <section className="relative flex bg-[#F6F6F6] px-50 items-center justify-center py-10 h-[500px]">
      <div className="flex flex-col absolute left-[350px]">
        <p className="text-[24px]">
          PERFECT JOURNEYS <br /> WITH JO LIMO
        </p>
        <p className="pt-5">
          Exquisite chauffeured services <br />
          via the Jo Limo app, available <br /> on iOS and Android.
        </p>
        <div className="flex pt-[60px] items-center gap-4">
          <Image
            src="/images/jolimo-app-logo.png"
            alt="Jo Limo App Logo"
            width={45}
            height={45}
          />
          <div className="flex items-center gap-1">
            <FileDownloadOutlinedIcon />
            <p>DOWNLOAD THE APP</p>
          </div>
        </div>
      </div>
      <div className="absolute h-[420px] border-l border-gray-300"></div>
      <Image
        src="/images/jolimo-app.png"
        alt="Jo Limo App"
        width={348}
        height={0}
        className="absolute max-[1500px]:right-[250px] right-[350px] bottom-0 "
      />
    </section>
  );
}
