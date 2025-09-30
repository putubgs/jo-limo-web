"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";
import Link from "next/link";
import { SimpleServiceContent } from "@/data/simpleServiceContent";

interface SimpleServicePageProps {
  content: SimpleServiceContent;
}

export default function SimpleServicePage({ content }: SimpleServicePageProps) {
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto md:px-4 px-0 text-center pt-10 md:pt-20 gap-6 md:gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[32px] md:text-[64px] leading-tight px-2">
            {content.title}
          </h1>
          <p className="mt-2 md:mt-4 max-w-[350px] md:max-w-[800px] mx-auto text-[16px] md:text-[20px] px-2">
            {content.description}
          </p>
          <>
            <Link
              href="/"
              className="md:hidden rounded-lg mt-4 px-6 py-3 bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[16px] font-bold"
            >
              Reserve Your Journey
            </Link>
            <button className="hidden md:flex gap-2 md:gap-4 items-center font-regular mt-6 md:mt-12">
              <p className="text-[14px] md:text-[16px]">AVAILABLE IN THE APP</p>
              <Image
                src="/images/jolimo-app-logo.png"
                alt="Jo Limo App Logo"
                width={24}
                height={24}
                className="md:w-[29px] md:h-[29px]"
              />
            </button>
          </>
        </div>

        <div className="md:mt-8 mt-4 md:w-full w-screen md:px-20">
          <Image
            src={content.heroImage}
            alt={content.heroImageAlt}
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto px-4 md:pt-12 pt-0 pb-20 w-full flex flex-col mt-10 items-center justify-center">
        <div className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-full justify-center max-w-[850px] md:gap-[65px] gap-10">
            <p className="md:text-[24px] text-[16px]">
              {content.mainDescription}
            </p>
            <div>
              {content.features.map((feature, index) => (
                <div key={index}>
                  <p className="text-[16px]">{feature.title}</p>
                  <p className="mt-4 text-[16px]">{feature.description}</p>
                  {index < content.features.length - 1 && (
                    <div className="mt-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="md:block hidden">
        <AppBanner />
      </div>
      <Footer />
    </>
  );
}
