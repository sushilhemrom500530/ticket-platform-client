'use client'

// import forgot_image from "../../../assets/auth/verify.png";
import Image from 'next/image';
import React, { useState, useRef, Suspense } from 'react';
import { Button, message } from 'antd';
import { useAuthService } from "@/src/hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

function OTPVerifyContent() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp, resendOtp } = useAuthService();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';


  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    await resendOtp({ email })
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const pastedArray = pastedData.split('').filter(char => /^\d$/.test(char));

    if (pastedArray.length > 0) {
      const newOtp = [...otp];
      pastedArray.forEach((char, i) => {
        if (i < 6) {
          newOtp[i] = char;
        }
      });
      setOtp(newOtp);

      const nextIndex = Math.min(pastedArray.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      message.error('Please enter the complete OTP');
      return;
    }

    if (!email) {
      message.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      message.error("Invalid email format");
      return;
    }

    setLoading(true);
    await verifyOtp({ email, otp: otpString })

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white w-full">
      <div className="flex items-center justify-center gap-10 md:gap-5 lg:gap-12 container mx-auto">
        <div className="lg:w-[725px] h-[520px] hidden md:block">
          {/* <Image
            src={forgot_image}
            alt="logo"
            width={0}
            height={0}
            className="w-full h-full"
          /> */}
        </div>
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0A0A0A] mb-6">
            Verify OTP
          </h1>
          <p className="text-xl lg:text-2xl text-[#6E6E6E] mb-6">
            Please check your email. We have sent a code to <span className="text-[#24160E]">{email}</span>
          </p>

          {/* OTP Input Fields */}
          <div className="my-8 flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-[16px] text-center md:text-xl font-semibold text-[#0A0A0A] border-1 border-[#6E6E6E] focus:!border-primary focus:outline-none transition-colors"
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-base text-[#000000]">
              Didn’t receive code?
            </p>
            <button onClick={handleResendOtp} className="text-base font-bold text-primary hover:text-primary/80 [transition:03s] cursor-pointer">
              Resend
            </button>
          </div>
          <div className="my-4">
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleSubmit}
              className="w-full !rounded-full !py-6 bg-primary hover:!bg-[#8A2CE2]/90 text-xl !font-semibold"
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OTPVerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    }>
      <OTPVerifyContent />
    </Suspense>
  );
}
