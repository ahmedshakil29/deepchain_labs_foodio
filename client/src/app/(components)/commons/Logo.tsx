import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-[8.09px] opacity-100">
      {/* Image */}
      <Image
        src="/assets/foodio.jpg"
        alt="Logo"
        width={26}
        height={26}
        priority
      />

      {/* Text */}
      <span
        className="text-[#1A3C34] font-[CormorantGaramond] font-semibold text-[26px] leading-[100%] tracking-[-5%]"
        style={{ lineHeight: "100%" }}
      >
        Foodio.
      </span>
    </div>
  );
};

export default Logo;
