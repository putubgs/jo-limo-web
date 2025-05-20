import Image from "next/image";

export default function Header() {
  return (
    // <div className="">
    //   <Image
    //     src="/images/black-line-header.png"
    //     width={1000} // Use actual width of your image
    //     height={200} // Use actual height of your image
    //     sizes="100vw"
    //     style={{
    //       width: "100%",
    //       height: "200px", // Set your desired shorter height here
    //       objectFit: "cover", // This crops the image to fit the container
    //       objectPosition: "center top", // Show the top part of the image
    //     }}
    //     alt="header image"
    //   />
    //   its iamge
    // </div>
    <div
      className="relative
    flex flex-col items-center justify-center
    bg-[url('/images/black-line-header.png')] bg-cover bg-top
    w-full h-52 border-b"
    >
      {/* wrap logo+nav in a relative z-20 container */}
      <div className="flex flex-col relative z-20 flex items-center gap-10">
        <Image
          alt="Jo Limo Logo"
          src="/images/jolimo-logo.png"
          width={82}
          height={82}
        />
        <div className="flex items-center gap-20">
          <div>SERVICES</div>
          <div>MEMBERSHIP</div>
          <div>CITIES & CLASSES</div>
          <div>CORPORATE MOBILITY</div>
          <div>RESERVE NOW</div>
        </div>
      </div>

      {/* gradient overlay, lower z-index */}
      <div
        className="absolute bottom-0 left-0 w-full h-[180px]
      bg-gradient-to-t from-white to-transparent
      pointer-events-none
      z-10"
      />
    </div>
  );
}
