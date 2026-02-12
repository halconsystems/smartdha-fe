"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { FaEarListen } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter()

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F3F6F9] overflow-hidden">

      {/* LEFT IMAGE - hidden on mobile, visible on md+ */}
      <div className="hidden md:flex relative md:w-[50%] lg:w-[55%] md:my-[30px] md:ml-[30px] lg:my-[40px] lg:ml-[40px] flex-shrink-0 min-h-[400px]">
        <Image
          src="/images/login-sideimg.png"
          alt="Login Image"
          fill
          className="object-contain rounded-2xl"
        />
      </div>

      {/* MOBILE TOP IMAGE - only visible on small screens */}
      <div className="md:hidden relative w-[full] h-[280px] flex-shrink-0 my-[20px] mx-[20px]">
        <Image
          src="/images/login-sideimg.png"
          alt="Login Image"
          fill
          className="object-contain rounded-sm"
        />
      </div>

{/* RIGHT FORM */}
<div className="flex-1 flex justify-center items-center py-8 px-4 md:py-0">
  <div className="flex flex-col items-center w-full max-w-[420px] sm:max-w-[380px] md:max-w-[420px] sm:max-h-[600px]">

    {/* LOGO */}
    <div className="mb-2 sm:mb-2 md:mb-3">
      <Image
        src="/images/DHA logo.png"
        alt="Logo"
        width={88}
        height={88}
        className="object-contain w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] lg:w-[88px] lg:h-[88px]"
      />
    </div>

    {/* HEADINGS */}
    <div className="text-center mb-4 sm:mb-4 md:mb-6">
      <h1 className="text-[15px] sm:text-[16px] md:text-[18px] font-semibold tracking-wide text-gray-900 mb-1">
        Welcome to DHA Karachi
      </h1>
      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-normal text-[#A5A5A5] tracking-wide">
        Smart Society · Home for Defenders
      </p>
    </div>

    {/* FORM */}
    <div className="w-full px-1 sm:px-0">

      {/* SIGN IN LABEL */}
      <h2 className="text-[16px] sm:text-[16px] md:text-[18px] font-semibold text-gray-900 mb-3 md:mb-4">
        Sign In
      </h2>

      {/* CNIC INPUT */}
      <div className="bg-white shadow-md rounded-[10px] px-4 py-2.5 sm:py-3 mb-3 w-full">
        <span className="text-[#30B33D] text-[11px] sm:text-xs font-semibold block mb-1">CNIC</span>
        <input
          type="text"
          placeholder="CNIC (e.g. 420401-8732608-7)"
          className="text-[13px] sm:text-sm text-gray-700 focus:outline-none w-full bg-transparent placeholder-gray-400"
        />
      </div>

      {/* PASSWORD INPUT */}
      <div className="bg-white shadow-md rounded-[10px] px-4 py-2.5 sm:py-3 mb-2 w-full relative">
        <span className="text-[#30B33D] text-[11px] sm:text-xs font-semibold block mb-1">Password</span>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password Here"
          className="text-[13px] sm:text-sm text-gray-700 focus:outline-none w-full bg-transparent placeholder-gray-400 pr-8"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#30B33D]"
        >
          {showPassword ? (
            <FaEyeSlash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <FaEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>

      {/* FORGOT PASSWORD */}
      <div className="flex justify-end mb-3 md:mb-4">
        <a href="#" className="text-[12px] sm:text-[13px] font-medium text-[#30B33D]">
          Forgot Password?
        </a>
      </div>

      {/* CHECKBOX */}
      <div className="flex items-center mb-4 md:mb-5">
        <input
          type="checkbox"
          id="terms"
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded accent-[#30B33D] cursor-pointer flex-shrink-0"
        />
        <label
          htmlFor="terms"
          className="ml-2.5 sm:ml-3 text-[12px] sm:text-[13px] font-medium text-gray-700 cursor-pointer select-none"
        >
          I Agree to Terms &amp; Conditions
        </label>
      </div>

      {/* LOGIN BUTTON */}
      <button
        type="button"
        className="w-full bg-[#30B33D] text-white rounded-[10px] font-semibold text-[14px] sm:text-[15px] md:text-[16px] py-2.5 sm:py-3 hover:bg-[#28a537] active:bg-[#229930] transition-colors mb-4 md:mb-5"
      >
        Login
      </button>

      {/* SIGNUP TEXT */}
      <div className="flex justify-center items-center mb-4 md:mb-6">
        <span className="text-[12px] sm:text-[13px] text-gray-700">
          Don&apos;t have an account?
        </span>
        <a href="#" className="ml-1 text-[12px] sm:text-[13px] font-semibold text-[#30B33D]">
          Sign Up
        </a>
      </div>

      {/* FOOTER LINKS */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 flex-wrap">
        <button onClick={()=> router.push('/contact-support')} className="flex items-center gap-1.5 sm:gap-2">
          <FaUser className="text-[#30B33D] w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-800">
            Contact Support
          </span>
        </button>
        <button onClick={()=> router.push('/about')} className="flex items-center gap-1.5 sm:gap-2">
          <FaEarListen className="text-[#30B33D] w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-800">
            About Us
          </span>
        </button>
      </div>

    </div>
  </div>
</div>
    </div>
  );
};

export default LoginForm;