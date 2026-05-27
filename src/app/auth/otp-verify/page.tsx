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
    <div className="flex min-h-screen bg-white w-full overflow-hidden">
      <style>{`
        @keyframes blob-bounce-auth {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.15); }
            66% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes blob-bounce-auth-2 {
            0%, 100% { transform: translate(0, 0) scale(1.1); }
            50% { transform: translate(-50px, 50px) scale(0.85); }
        }
        @keyframes blob-bounce-auth-3 {
            0%, 100% { transform: translate(0, 0) scale(0.9); }
            50% { transform: translate(60px, -30px) scale(1.2); }
        }
        @keyframes blob-bounce-auth-4 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-40px, -40px) scale(0.95); }
        }
        .animate-blob-auth-1 {
            animation: blob-bounce-auth 20s ease-in-out infinite;
        }
        .animate-blob-auth-2 {
            animation: blob-bounce-auth-2 25s ease-in-out infinite;
        }
        .animate-blob-auth-3 {
            animation: blob-bounce-auth-3 18s ease-in-out infinite;
        }
        .animate-blob-auth-4 {
            animation: blob-bounce-auth-4 28s ease-in-out infinite;
        }
      `}</style>

      {/* Left Side: Animated Blobs */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0052cc] to-[#003d99] relative items-center justify-center p-12 text-white">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-[#0066ff] to-[#0047b3] rounded-full animate-blob-auth-1 blur-2xl opacity-50 mix-blend-screen"></div>
        <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#00bfff] to-[#0047b3] rounded-full animate-blob-auth-2 animation-delay-2000 blur-2xl opacity-50 mix-blend-screen"></div>
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-[#0066ff] to-[#003d99] rounded-full animate-blob-auth-3 animation-delay-4000 blur-2xl opacity-50 mix-blend-screen"></div>

        <div className="absolute -left-32 bottom-0 w-[500px] h-[500px] bg-[#0066ff] rounded-full animate-blob-auth-1"></div>
        <div className="absolute -right-32 top-10 w-[300px] h-[300px] bg-[#0066ff] rounded-full animate-blob-auth-4 animation-delay-4000"></div>

        <div className="relative z-10 text-left max-w-lg -ml-20">
          <h1 className="text-6xl font-bold mb-4 tracking-wider uppercase drop-shadow-lg">ALMOST THERE</h1>
          <h2 className="text-2xl font-bold mb-8 tracking-widest uppercase drop-shadow-md">VERIFY YOUR IDENTITY</h2>
          <p className="text-sm text-blue-100 leading-relaxed font-light drop-shadow-sm">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
            erat volutpat. Ut wisi enim ad minim quis nostrud exerci tation
          </p>
        </div>
      </div>

      {/* Right Side: OTP Verify Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#0066ff] rounded-full animate-blob-auth-1 opacity-90 hidden lg:block"></div>

        <div className="w-full max-w-md relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-3">
            Verify OTP
          </h1>
          <p className="text-[#6E6E6E] mb-8 text-sm">
            Please check your email. We have sent a code to <span className="font-bold text-[#1A1A1A]">{email}</span>
          </p>

          {/* OTP Input Fields */}
          <div className="my-8 flex justify-center gap-2 sm:gap-3">
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
                className="w-12 h-12 md:w-14 md:h-14 bg-[#F5F5F5] hover:bg-[#EBEBEB] focus:bg-[#EBEBEB] rounded-xl text-center text-xl md:text-2xl font-bold text-[#1A1A1A] focus:outline-none transition-colors border-none shadow-sm"
              />
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-500 font-medium">
              Didn't receive code?
            </p>
            <button onClick={handleResendOtp} className="text-sm font-bold text-[#0052cc] hover:text-[#003d99] transition-colors cursor-pointer">
              Resend
            </button>
          </div>

          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleSubmit}
            className="w-full !h-14 !rounded-xl bg-[#004b93] hover:!bg-[#003d7a] text-lg font-semibold shadow-md mb-6"
          >
            Verify
          </Button>
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
