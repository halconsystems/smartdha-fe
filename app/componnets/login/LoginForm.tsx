"use client";

import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { FaEarListen } from "react-icons/fa6";

const LoginForm = () => {
  return (
    <div className="min-h-screen flex ">
      {/* LEFT IMAGE */}
 <div className="hidden md:flex relative w-[864px] h-[864px] top-[59px] left-[51px] opacity-100">
        <Image
          src="/images/login-sideimg.png"
          alt="Login Image"
          fill
          className="object-cover rounded-lg"
          style={{ transform: 'rotate(0deg)' }}
        />
      </div>

      {/* RIGHT FORM - EXACT LAYOUT DIMENSIONS */}
      <div className="flex-1 flex justify-center items-start relative">
        <div 
          className="relative bg-white shadow-lg flex flex-col items-center"
          style={{
            width: '448.32574462890625px',
            height: '673.9255981445312px',
            top: '154px',
            opacity: 1
          }}
        >
          <form className="w-full h-full relative flex flex-col items-center">
            {/* LOGO */}
            <div className="absolute w-24 h-24" style={{ top: '32px' }}>
              <Image
                src="/images/DHA logo.png"
                alt="Logo"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>

            {/* HEADINGS */}
            <div className="absolute text-center" style={{ top: '140px' }}>
              <h1 className="text-[18px] font-inter font-semibold tracking-[0.02em] leading-tight">
                Welcome to DHA Karachi
              </h1>
              <p className="text-[16px] font-inter tracking-[0.02em] leading-tight">
                Smart Society · Home for Defenders
              </p>
            </div>

            {/* SIGN IN TEXT */}
            <h2 
              className="absolute text-[18px] font-inter font-semibold leading-[22px] opacity-100"
              style={{
                width: '59px',
                height: '22px',
                top: '203.43px',
                left: '44px'
              }}
            >
              Sign In
            </h2>
            
            {/* CNIC */}
            <div 
              className="absolute bg-white shadow-md p-3 flex flex-col justify-center"
              style={{
                width: '361.151px',
                height: '62.267px',
                top: '242.77px',
                left: '44px',
                borderRadius: '9.96px'
              }}
            >
              <span className="text-[#30B33D] text-xs font-medium">CNIC</span>
              <input
                type="text"
                placeholder="CNIC (e.g. 420401-8732608-7)"
                className="mt-1 text-sm focus:outline-none w-full bg-transparent"
              />
            </div>

            {/* PASSWORD */}
            <div 
              className="absolute bg-white shadow-md p-3 flex flex-col justify-center"
              style={{
                width: '361.151px',
                height: '62.267px',
                top: '324px',
                left: '44px',
                borderRadius: '9.96px'
              }}
            >
              <span className="text-[#30B33D] text-xs font-medium">Password</span>
              <input
                type="password"
                placeholder="Password Here"
                className="mt-1 text-sm focus:outline-none w-full bg-transparent"
              />
            </div>

            {/* FORGOT PASSWORD */}
            <a
              href="#"
              className="absolute text-[13px] font-inter font-medium text-[#30B33D] leading-[16px] text-left opacity-100"
              style={{
                width: '112px',
                height: '16px',
                top: '393.46px',
                left: '293.22px'
              }}
            >
              Forgot Password?
            </a>

            {/* CHECKBOX */}
            <div 
              className="absolute flex items-center opacity-100"
              style={{
                width: '224.85px',
                height: '27.4px',
                top: '428px',
                left: '44px',
                borderRadius: '4.98px'
              }}
            >
              <input
                type="checkbox"
                id="terms"
                className="w-5 h-5 rounded-sm accent-[#30B33D]"
              />
              <label
                htmlFor="terms"
                className="ml-3 w-[185px] h-[16px] text-[13px] font-inter font-medium leading-[16px] text-gray-700"
              >
                I Agree to Terms & Conditions
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <button
              className="absolute bg-[#30B33D] text-white rounded-[10px] font-inter font-medium text-[16px] text-center opacity-100 hover:bg-[#28a537] transition-colors"
              style={{
                width: '361.151px',
                height: '43.587px',
                top: '480.63px',
                left: '44px',
                lineHeight: '43.587px'
              }}
            >
              Login
            </button>

            {/* SIGNUP TEXT */}
            <div 
              className="absolute flex justify-center items-center space-x-1 opacity-100"
              style={{
                width: '191px',
                height: '16px',
                top: '555.11px',
                left: '129px'
              }}
            >
              <span className="font-inter font-normal text-[13px] leading-[16px] tracking-[0.02em] text-gray-700 whitespace-nowrap">
                Don’t have an account?
              </span>
              <a
                href="#"
                className="font-inter font-semibold text-[13px] leading-[16px] tracking-[0.02em] text-[#30B33D] whitespace-nowrap"
              >
                Login
              </a>
            </div>

            {/* FOOTER LINKS */}
            <div 
              className="absolute flex items-center justify-start opacity-100 space-x-6"
              style={{
                width: '261px',
                height: '20px',
                top: '608px',
                left: '94px'
              }}
            >
              <div className="flex items-center space-x-2" style={{ width: '136.93px', height: '19.93px' }}>
                <FaUser className="text-[#30B33D] w-4 h-4" />
                <span className="font-inter font-medium text-[14px] leading-[20px] text-gray-800 whitespace-nowrap">
                  Contact Support
                </span>
              </div>
              <div className="flex items-center space-x-2" style={{ width: '90.15px', height: '19.93px' }}>
                <FaEarListen className="text-[#30B33D] w-4 h-4" />
                <span className="font-inter font-medium text-[14px] leading-[20px] text-gray-800 whitespace-nowrap">
                  About Us
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;