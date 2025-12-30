"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7FAFC] text-gray-800 px-4">
      {/* <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      > */}
      <h1 className="text-9xl font-extrabold text-[#1A3C34] mb-4">404</h1>
      <p className="text-2xl md:text-3xl font-semibold mb-6">
        Oops! Page not found
      </p>
      <p className="text-gray-600 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-[#1A3C34] text-white rounded-lg hover:bg-[#16332a] transition"
        >
          Go Back
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white border border-[#1A3C34] text-[#1A3C34] rounded-lg hover:bg-[#1A3C34] hover:text-white transition"
        >
          Go Home
        </Link>
      </div>
      {/* </motion.div> */}
    </div>
  );
};

export default NotFoundPage;
