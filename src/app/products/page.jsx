"use client";
import { useRouter } from 'next/navigation';
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import HeroSectionOne from "@/components/hero-section-demo-1";
import { Timeline } from "@/components/ui/timeline";
import Footer from "../../../components/Footer";

export default function Home() {
  const router = useRouter();

  const data = [
    {
      title: "Shetkari Krushi Software",
      content: (
        <div>
          <p className="mb-8 text-s font-normal text-white md:text-sm dark:text-neutral-200">
            Track Sales, Purchases & Dues with Ease! Very easy and useful farmer
            Krishi Billing Software for billing of Krishi Seva Kendras (Serving
            1500+ Krishi Seva Kendras)
          </p>
          <p className="mb-8 text-s font-normal text-white md:text-sm dark:text-neutral-200">
            This mobile app is designed for shop owners to efficiently manage
            their stock, purchases, sales prices, and credit transactions
          </p>
          <p className="mb-8 text-s font-normal text-white md:text-sm dark:text-neutral-200">
            Efficient Stock Management Sales as per upcoming expiry of stock
            Single View for Outstanding.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src="./mobileksk.png" alt="KSK" className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60" />
            <img src="./2-21.png" alt="KSK 2" className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60" />
          </div>
          <div className="mt-8 flex justify-start">
            <button
              className="px-6 py-2 bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm"
              onClick={() => router.push('/ksk')}
            >
              Know More
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Shopcare Billing Software",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-white md:text-sm dark:text-neutral-200">
            POS system software with Inventory & Barcode. Simple interfaces for billing, quotation, purchase, and more.
          </p>
          <p className="mb-8 text-xs font-normal text-white md:text-sm dark:text-neutral-200">
            Robust GST/Non-GST billing, very easy to handle and designed for 1500+ happy clients since 2012.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src="./images/shop.png" alt="Shopcare" className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60" />
            <img src="./dashboard.png" alt="Shopcare Dashboard" className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60" />
          </div>
          <div className="mt-8 flex justify-start">
            <button
              className="px-6 py-2 bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm"
              onClick={() => router.push('/sbs')}
            >
              Know More
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "K-Bazzar Billing Software",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal text-white md:text-sm dark:text-neutral-200">
            A perfect solution for grocery shops. Manage customer points, GST/Non-GST, and stock from multiple locations.
          </p>
          <div className="mb-8 space-y-1 text-xs text-white md:text-sm dark:text-neutral-300">
            <div>Customer Point System</div>
            <div>Outstanding Supplier & Customer View</div>
            <div>Barcode Billing Interface</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="./k-bb.png" alt="K-Bazzar" className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60" />
            <img src="./tax.png" alt="Tax View" className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60" />
          </div>
          <div className="mt-8 flex justify-start">
            <button
              className="px-6 py-2 bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm"
              onClick={() => router.push('/k-bazar')}
            >
              Know More
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Pharma - Chemist Vision",
      content: (
        <div>
          <p className="mb-8 text-s font-normal text-white md:text-sm dark:text-neutral-200">
            Profit & Loss Reports, Combined Outstanding Reports, GST Billing — a complete solution for medical stores.
          </p>
          <p className="mb-8 text-s font-normal text-white md:text-sm dark:text-neutral-200">
            Date-wise analysis, customer-wise reports, and powerful accounting tools.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src="./pc-1.png" alt="Pharma" className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60" />
          </div>
          <div className="mt-8 flex justify-start">
            <button
              className="px-6 py-2 bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm"
              onClick={() => router.push('/pharma')}
            >
              Know More
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <HeroSectionOne />
      <div className="overflow-hidden dark:bg-[#0B0B0F] bg-black w-full -mt-[5cm]">
        <div className="transform scale-150 md:scale-175 lg:scale-110">
          <MacbookScroll
            title={
              <div className="text-center">
                <span className="text-7xl font-semibold font-sans">
                  <span className="text-blue-500">Simplify</span> <span className="text-white">the complex.</span>
                </span>
                <p className="text-2xl text-gray-500 mt-2">
                  Easy to integrate, easy to use, and easy to scale. <br /><br />
                </p>
              </div>
            }
            src={`/linear.webp`}
            showGradient={false}
          />
        </div>
      </div>
      <Timeline data={data} />
      <Footer />
    </>
  );
}
