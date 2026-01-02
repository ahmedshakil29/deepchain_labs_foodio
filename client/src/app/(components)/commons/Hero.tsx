// "use client";
// import React from "react";
// import Image from "next/image";
// import { ArrowRight } from "lucide-react";
// import Button from "./Button";

// const Hero = () => {
//   return (
//     <section className="relative -z-10 px-4 pt-24 md:px-8 lg:px-16">
//       <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
//         {/* Left content */}
//         <div className="text-center lg:text-left">
//           <div className="mx-auto mb-4 flex w-fit items-center gap-1 rounded-full bg-secondary px-3 py-1 lg:mx-0">
//             <Image
//               src="/assets/dashboard.png"
//               alt="Menu logo"
//               width={16}
//               height={16}
//             />
//             <span className="font-body text-sm font-semibold text-secondary-foreground">
//               Food Ordering Service
//             </span>
//           </div>

//           <h1 className="mb-6 font-title text-4xl font-semibold leading-tight tracking-tight text-primary sm:text-5xl lg:text-[72px]">
//             Where Great Food <br className="hidden sm:block" />
//             Meets Great Taste.
//           </h1>

//           <p className="mx-auto mb-8 max-w-xl font-body text-base text-secondary-foreground sm:text-lg lg:mx-0">
//             Experience a symphony of flavors crafted with passion. Premium
//             ingredients, exquisite recipes, delivered to your door.
//           </p>

//           <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
//             <Button
//               text="Order Now"
//               icon={ArrowRight}
//               iconPosition="right"
//               className="bg-primary text-white shadow-2xl shadow-primary"
//             />

//             <Button
//               text="View Menu"
//               className="border border-primary text-primary bg-transparent"
//             />
//           </div>
//         </div>

//         {/* Right content */}
//         <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
//           <Image
//             src="/assets/banner-bg.png"
//             alt="Banner background frame"
//             width={608}
//             height={565}
//             className="w-full"
//             priority
//           />

//           <Image
//             src="/assets/dashboard.png"
//             alt="Banner image"
//             width={474}
//             height={474}
//             className="absolute bottom-0 left-1/2 z-10 w-[80%] -translate-x-1/2 sm:w-[70%] lg:left-auto lg:translate-x-0"
//           />

//           <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-black opacity-15 blur-xl sm:h-40 sm:w-40 lg:left-12 lg:translate-x-0" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

// "use client";

// import Button from "@/app/(components)/commons/Button";
// import Image from "next/image";

// export default function Hero() {
//   const handleOrderNow = () => {
//     window.location.href = "/foodmenu";
//   };

//   const handleViewMenu = () => {
//     window.location.href = "/foodmenu";
//   };

//   return (
//     <div className="min-h-screen bg-[#FAFAF8]">
//       <section className="relative w-full min-h-150 bg-white overflow-hidden">
//         <div className="max-w-[1400px] mx-auto px-8 py-12 flex items-center justify-between gap-12">
//           {/* Left Content */}
//           <div className="flex-1 max-w-[600px] z-10">
//             <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#FEF7EA] rounded-full shadow-sm">
//               <span className="text-[14px]  font-medium text-[#1A3C34]">
//                 🔑 Food Ordering Service
//               </span>
//             </div>

//             <h1
//               className="text-[72px] font-bold leading-[1.1] mb-6 text-[#1A1A1A]"
//               style={{ fontFamily: "Playfair Display, serif" }}
//             >
//               Where Great Food
//               <br />
//               Meets Great Taste.
//             </h1>

//             <p className="text-[18px] leading-[28px] text-[#666666] mb-8 max-w-[500px]">
//               Experience a symphony of flavors crafted with passion. Premium
//               ingredients, exquisite recipes, delivered to your door.
//             </p>

//             <div className="flex items-center gap-4">
//               <Button
//                 text="Order Now"
//                 iconPosition="right"
//                 width="w-[160px]"
//                 height="h-[52px]"
//                 bgColor="#1A3C34"
//                 textColor="#FFFFFF"
//                 onClick={handleOrderNow}
//                 className="font-semibold text-[16px]"
//               />
//               <Button
//                 text="View Menu"
//                 width="w-[160px]"
//                 height="h-[52px]"
//                 bgColor="transparent"
//                 textColor="#1A3C34"
//                 onClick={handleViewMenu}
//                 className="font-semibold text-[16px] border-2 border-[#1A3C34]"
//               />
//             </div>
//           </div>

//           {/* Right Image */}
//           <div
//             className="absolute right-0 top-0 h-full w-1/2 bg-[#FEF7EA] rounded-bl-lg"
//             style={{
//               borderBottomLeftRadius: "210px",
//             }}
//           >
//             <div
//               className="relative flex-shrink-0  "
//               style={{ width: "608px", height: "565px" }}
//             >
//               <div
//                 className="absolute bg-[#FEF7EA]"
//                 style={{
//                   width: "608px",
//                   height: "560px",
//                   borderBottomLeftRadius: "210px",
//                   top: 0,
//                   left: 0,
//                   zIndex: 1,
//                 }}
//               />
//               <div
//                 className="absolute overflow-hidden"
//                 style={{
//                   width: "474px",
//                   height: "474px",
//                   borderRadius: "237px",
//                   top: "45px",
//                   left: "67px",
//                   zIndex: 2,
//                 }}
//               >
//                 <Image
//                   src="/assets/dashboard.png"
//                   alt="Delicious pasta dish"
//                   width={800}
//                   height={600}
//                   className="w-full h-full object-cover"
//                   priority
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// import React from "react";
// import Button from "./Button";
// import { ArrowRight } from "lucide-react";

// export default function Hero() {
//   const handleOrderNow = () => {
//     window.location.href = "/foodmenu";
//   };

//   const handleViewMenu = () => {
//     window.location.href = "/foodmenu";
//   };

//   return (
//     <section className="relative w-full min-h-[650px] bg-white overflow-hidden">
//       <div className="max-w-[1400px] mx-auto px-8 py-12 flex items-center justify-between gap-12">
//         <div className="flex-1 max-w-[600px] z-10">
//           <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#FEF7EA] rounded-full shadow-sm">
//             <span className="text-[14px] font-medium text-[#1A3C34]">
//               🍽 Food Ordering Service 🔑
//             </span>
//           </div>

//           <h1
//             className="text-[72px] font-bold leading-[1.1] mb-6 text-[#1A1A1A]"
//             style={{ fontFamily: "Playfair Display, serif" }}
//           >
//             Where Great Food
//             <br />
//             Meets Great Taste.
//           </h1>

//           <p className="text-[18px] leading-[28px] text-[#666666] mb-8 max-w-[500px]">
//             Experience a symphony of flavors crafted with passion. Premium
//             ingredients, exquisite recipes, delivered to your door.
//           </p>

//           <div className="flex items-center gap-4">
//             <Button
//               text="Order Now"
//               icon={ArrowRight}
//               iconPosition="right"
//               width="w-[160px]"
//               height="h-[52px]"
//               bgColor="#1A3C34"
//               textColor="#FFFFFF"
//               onClick={handleOrderNow}
//               className="font-semibold text-[16px]"
//             />
//             <Button
//               text="View Menu"
//               width="w-[160px]"
//               height="h-[52px]"
//               bgColor="transparent"
//               textColor="#1A3C34"
//               onClick={handleViewMenu}
//               className="font-semibold text-[16px] border-2 border-[#1A3C34]"
//             />
//           </div>
//         </div>

//         <div
//           className="relative flex-shrink-0"
//           style={{ width: "608px", height: "565px" }}
//         >
//           <div
//             className="absolute bg-[#FEF7EA]"
//             style={{
//               width: "608px",
//               height: "560px",
//               borderBottomLeftRadius: "210px",
//               top: 0,
//               left: 0,
//               zIndex: 1,
//             }}
//           />
//           <div
//             className="absolute overflow-hidden"
//             style={{
//               width: "474px",
//               height: "474px",
//               borderRadius: "237px",
//               top: "45px",
//               left: "67px",
//               zIndex: 2,
//             }}
//           >
//             <img
//               src="/assets/dashboard.png"
//               alt="Delicious pasta dish"
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React from "react";
import Button from "./Button";
import { ButtonTwo } from "./ButtonTwo";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleOrderNow = () => {
    router.push("/auth");
  };

  const handleViewMenu = () => {
    router.push("/foodmenu");
  };

  return (
    <section className="relative w-full min-h-[650px] bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Text Content */}
        <div className="flex-1 w-full z-10 text-center md:text-left max-w-full md:max-w-[600px]">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 bg-[#FEF7EA] rounded-full shadow-sm">
            <span className="text-[12px] md:text-[14px] font-medium text-[#1A3C34]">
              🍽 Food Ordering Service 🔑
            </span>
          </div>

          <h1
            className="text-[40px] md:text-[72px] font-bold leading-[1.1] mb-4 md:mb-6 text-[#1A1A1A]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Where Great Food
            <br />
            Meets Great Taste.
          </h1>

          <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-[#666666] mb-6 md:mb-8 max-w-full md:max-w-[500px] mx-auto md:mx-0">
            Experience a symphony of flavors crafted with passion. Premium
            ingredients, exquisite recipes, delivered to your door.
          </p>

          <div className="flex items-center gap-4 justify-center md:justify-start flex-col md:flex-row">
            {/* <Button
              text="Order Now"
              icon={ArrowRight}
              iconPosition="right"
              width="w-full md:w-[160px]"
              height="h-[52px]"
              bgColor="#1A3C34"
              textColor="#FFFFFF"
              onClick={handleOrderNow}
              className="font-semibold text-[16px]"
            /> */}
            <ButtonTwo
              size="lg"
              className="rounded-tr-none shadow-2xl shadow-primary"
            >
              Order Now <ArrowRight />{" "}
            </ButtonTwo>
            <ButtonTwo size="lg" variant="outline" className="rounded-tl-none">
              View Menu
            </ButtonTwo>
            {/* <Button
              text="View Menu"
              width="w-full md:w-[160px]"
              height="h-[52px]"
              bgColor="transparent"
              textColor="#1A3C34"
              onClick={handleViewMenu}
              className="font-semibold text-[16px] border-2 border-[#1A3C34]"
            /> */}
          </div>
        </div>

        {/* Image Wrapper - Responsive Sizing */}
        <div className="relative flex-shrink-0 w-[320px] h-[320px] md:w-[608px] md:h-[565px]">
          {/* Background Shape */}
          <div className="absolute bg-[#FEF7EA] w-[320px] h-[320px] md:w-[608px] md:h-[560px] rounded-bl-[110px] md:rounded-bl-[210px] top-0 left-0 z-10" />

          {/* Circular Image Container */}
          <div className="absolute overflow-hidden w-[240px] h-[240px] md:w-[474px] md:h-[474px] rounded-[120px] md:rounded-[237px] top-[40px] left-[40px] md:top-[45px] md:left-[67px] z-20">
            <Image
              src="/assets/dashboard.png"
              alt="Delicious pasta dish"
              width={474}
              height={474}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
