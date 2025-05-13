"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function HeroSection() {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-x-hidden">
      {/* Navbar at the top */}
      <Navbar />

      {/* Content Container */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center font-[Poppins]  text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Your medical questions answered, Instantly."
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 font-[Poppins] text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
         🌿 With Herb AI, getting the answers you need is effortless — from expert insights and personalized herbal recommendations to stunning AI-generated visuals tailored to your wellness journey.
        </motion.p>

      

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <Image
              src="/heroimage.jpg"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1500}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        {/* Replace the gradient circle with an image */}
        <div className="relative size-7 overflow-hidden rounded-full">
          <Image
            src="/logoimage.jpg" // Replace with your actual image path
            alt="Herb AI Logo"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-base font-bold font-[Poppins] md:text-2xl">Herb AI</h1>
      </div>
      <button
        onClick={() => router.push("/login")}
        className="w-24 transform rounded-lg bg-teal-600 px-6 py-2 font-medium font-[Poppins] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        Login
      </button>
    </nav>
  );
};

