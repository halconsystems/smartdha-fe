"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


const About = () => {
  const [activeTab, setActiveTab] = useState<'administration' | 'about'>('administration');
  const router = useRouter();
  return (
    <div className='h-screen overflow-hidden flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8'>
      {/* Left side image */}
      <div className='flex-1 relative '>
        <div className='sticky top-4 lg:top-8'>
          <div className='relative w-full h-[400px] md:h-[500px] lg:h-[calc(100vh-4rem)] rounded-[10px] overflow-hidden'>
            <Image
              src="/images/about-image.png"
              alt="about"
              fill
              className='object-contain'
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className='flex-1 flex items-start justify-center overflow-y-auto lg:overflow-hidden'>
        <div className='w-full max-w-md px-3 md:px-4 flex flex-col items-center justify-center py-2'>

          {/* Logo */}
          <Image
            src="/logos/dha-logo.png"
            alt="DHA Logo"
            width={80}
            height={80}
            className='mb-2 flex-shrink-0'
          />

          {/* Heading */}
          <h1 className='text-[18px] font-semibold text-gray-900 text-center'>
            Welcome to DHA Karachi
          </h1>

          {/* Description */}
          <p className='text-gray-600 leading-relaxed mb-3 text-[18px] md:text-base text-center'>
            Smart Society . Home for Defenders
          </p>

          {/* Divider Line */}
          <div className='w-full h-px bg-[#ECECEC] mb-4'></div>

          {/* Tabs */}
          <div className='flex w-full gap-0 mb-0'>
            <button
              onClick={() => setActiveTab('administration')}
              className={`flex-1 py-2.5 px-3 md:px-4 font-semibold transition-all text-[14px] cursor-pointer rounded-tr-none rounded-tl-xl ${activeTab === 'administration'
                ? 'bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]'
                : 'bg-gray-100 text-[#8D8D8D] border border-[#F3F6F9] shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20'
                }`}
            >
              <span>

                Administration Message
              </span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-2.5 px-3 md:px-4 font-semibold transition-all text-[14px] cursor-pointer rounded-tl-none rounded-tr-xl ${activeTab === 'about'
                ? 'bg-white text-[#30B33D] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]'
                : 'bg-gray-100 text-[#8D8D8D] border border-[#F3F6F9] shadow-[inset_0_4px_8px_rgba(225,227,238,0.95)] hover:text-[#30B33D]/70 hover:shadow-[inset_0_2px_4px_rgba(225,227,238,0.5)] hover:border-[#30B33D]/20'
                }`}
            >
              About DHA Karachi
            </button>
          </div>

          {/* Content Card */}
          <div className='w-full rounded-lg rounded-tl-none rounded-tr-none shadow-lg mb-6'>
            {activeTab === 'administration' ? (
              <div>
                <div className='flex justify-center px-4 pt-4'>
                  <Image
                    src="/images/brig-image.png"
                    alt='brig-image'
                    width={90}
                    height={60}
                    className='mb-3'
                  />
                </div>
                <div className='text-[13px] text-[#A5A5A5] border-b border-gray-200 px-4 pb-4'>
                  <p className='leading-relaxed'>
                    It is a matter of great pleasure to interact with DHA residents and extend my best wishes. DHA Karachi has emerged as the largest residential estate offering a blend of quality and modern living. We are committed to continuously improving facilities and ensuring a secure and enabling environment for all residents.
                  </p>
                  <p className='leading-relaxed mt-2'>
                    We will continue working with dedication and vision to maintain the high living standards DHA is known for. May Allah bless us all.
                  </p>
                </div>
                <div className='p-4 text-[#A5A5A5]'>
                  <div className='text-[13px] font-medium'>
                    Brig. Ameer Nawaz Khan
                  </div>
                  <div className='text-[12px]'>
                    Administrator DHA Karachi
                  </div>
                </div>
              </div>
            ) : (
              <div className='p-4 text-[13px]'>
                <p className='text-[#A5A5A5] leading-relaxed'>
                  Pakistan Defence Officers Housing Authority was established to provide world-class living standards to Armed Forces Officers, civilians, and their families. DHA Karachi is now the largest residential estate offering a blend of security, modern lifestyle, and community facilities.                </p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className='flex justify-center w-full'>
            <button onClick={() => router.back()} className='flex-1 py-2 mx-10 bg-[#30B33D] text-white rounded-lg font-semibold hover:bg-[#30B33D]/90 transition-colors shadow-md text-sm md:text-base'>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About;