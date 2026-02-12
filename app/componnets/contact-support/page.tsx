"use client";

import React from "react";
import Image from "next/image";
import { FaPhone, FaEnvelope, FaHeadset } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const ContactSupport = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F3F6F9] overflow-hidden">
            {/* LEFT IMAGE - hidden on mobile, visible on md+ */}
            <div className="hidden md:flex relative md:w-[50%] lg:w-[55%] md:my-[30px] md:ml-[30px] lg:my-[40px] lg:ml-[40px] flex-shrink-0 min-h-[400px]">
                <Image
                    src="/images/contact.png"
                    alt="Contact Image"
                    fill
                    className="object-contain rounded-2xl"
                    priority
                />
            </div>

            {/* MOBILE TOP IMAGE - only visible on small screens */}
            <div className="md:hidden relative w-full h-[280px] flex-shrink-0 my-[20px] mr-[20px]">
                <Image
                    src="/images/contact.png"
                    alt="Contact Image"
                    fill
                    className="object-contain rounded-sm"
                    priority
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
                        <h1 className="text-[15px] sm:text-[16px] md:text-[18px] font-semibold tracking-wide font-[inter] mb-1">
                            Welcome to DHA Karachi
                        </h1>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-normal font-[inter] text-[#A5A5A5] tracking-wide">
                            Smart Society · Home for Defenders
                        </p>
                    </div>

                    {/* FORM */}
                    <div className="w-full px-1 sm:px-0">

                        {/* CONTACT SUPPORT HEADER */}
                        <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold font-[inter] mb-4 md:mb-5">
                            Contact Support
                        </h2>

                        {/* CONTACT INFORMATION */}
                        <div className="space-y-4 md:space-y-5 mb-6 md:mb-7">
                            {/* ADDRESS */}
                            <div className="flex items-start gap-3">
                                <FaLocationDot className="text-[#30B33D] w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-[13px] sm:text-[14px] font-[inter] font-[400] leading-relaxed text-[#A5A5A5]">
                                    2-B East Street Ph-1 DHA Karachi-75500
                                </p>
                            </div>

                            {/* PHONE */}
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-[#30B33D] w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                <p className="text-[13px] sm:text-[14px] font-[inter] font-[400] text-[#A5A5A5]">
                                    Phone: +92 21 35886401-5
                                </p>
                            </div>

                            {/* UAN */}
                            <div className="flex items-center gap-3">
                                <FaHeadset className="text-[#30B33D] w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                <p className="text-[13px] sm:text-[14px] font-[inter] font-[400] text-[#A5A5A5]">
                                    UAN: +92 21 111-589-589
                                </p>
                            </div>

                            {/* EMAIL */}
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-[#30B33D] w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                <p className="text-[13px] sm:text-[14px] font-[inter] font-[400] break-all text-[#A5A5A5]">
                                    Dha@Dhakarahchi.Org
                                </p>
                            </div>

                            {/* HELPLINE */}
                            <div className="flex items-center gap-3">
                                <FaHeadset className="text-[#30B33D] w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                <p className="text-[13px] sm:text-[14px] font-[inter] font-[400] text-[#A5A5A5]">
                                    DHA Helpline: 1092
                                </p>
                            </div>
                        </div>

                        {/* DECORATIVE LINE */}
                        <div className="w-full border-t border-gray-200 my-5 md:my-6"></div>

                        {/* BACK BUTTON */}
                        <button
                            onClick={() => router.back()}
                            className="w-full bg-[#30B33D] text-white rounded-[10px] font-semibold font-[inter] text-[14px] sm:text-[15px] md:text-[16px] py-2.5 sm:py-3 hover:bg-[#28a537] active:bg-[#229930] transition-colors mb-4 md:mb-5"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;