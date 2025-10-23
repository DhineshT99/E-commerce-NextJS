import Image from "next/image";
import mastercard from "../assets/mastercard.jpg";
import rupay from "../assets/rupay.png";
import visa from "../assets/visa.png";

export const Footer = () => {
  return (
    <footer className="bg-black text-white w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-4">

        {/* Left Section - Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-2 gap-y-2 text-sm font-medium text-gray-300">
          <button className="flex items-center gap-2 hover:text-white transition">
            <span>🛍️</span>
            <span>Become a Seller</span>
          </button>
          <button className="flex items-center gap-2 hover:text-white transition">
            <span>🎁</span>
            <span>Gift Cards</span>
          </button>
          <button className="flex items-center gap-2 hover:text-white transition">
            <span>❓</span>
            <span>Help Center</span>
          </button>
        </div>

        {/* Center Section - Copyright */}
        <div className="md:order-none text-gray-400 text-xs md:text-sm text-center w-full md:w-auto py-2 md:py-0">
          © 2007–2025 NextCart.com
        </div>

        {/* Right Section - Payment Icons */}
        <div className="flex items-center gap-3">
          <Image src={visa} alt="Visa" width={44} height={28} className="object-contain" />
          <Image src={mastercard} alt="Mastercard" width={44} height={28} className="object-contain" />
          <Image src={rupay} alt="RuPay" width={44} height={28} className="object-contain" />
        </div>
      </div>
    </footer>
  );
};
