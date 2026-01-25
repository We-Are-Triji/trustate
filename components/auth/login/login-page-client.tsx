"use client";

import { LoginForm } from "@/components/auth/login/login-form";
import Image from "next/image";
import Link from "next/link";
import trustateLogo from "@/app/assets/trustate.png";

export default function LoginPageClient() {
    return (
        <main className="flex min-h-screen bg-[#0247ae] overflow-hidden">
            {/* Custom Styles for Background Motion Only (No Entrance Animations) */}
            <style jsx global>{`
        @keyframes waveMove {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-20px) translateY(5px); }
        }
        @keyframes waveMove2 {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes waveGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

            {/* Left Panel - Static Container with Moving Background */}
            <div
                className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col"
                style={{
                    background: 'linear-gradient(120deg, #0247ae 0%, #0873c9 20%, #0247ae 40%, #0873c9 60%, #0247ae 80%, #0873c9 100%)',
                    backgroundSize: '300% 100%',
                    animation: 'waveGradient 30s ease-in-out infinite'
                }}
            >
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.07]">
                    <div className="h-full w-full" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Bottom waves - Ambient Motion */}
                <svg
                    className="absolute -bottom-2 -left-20 w-[150%] h-80"
                    viewBox="0 0 800 320"
                    preserveAspectRatio="none"
                    style={{ animation: 'waveMove 6s ease-in-out infinite' }}
                >
                    <path
                        d="M0 200 Q200 120 400 170 Q600 220 800 150 L800 320 L0 320 Z"
                        fill="rgba(255,255,255,0.15)"
                    />
                </svg>
                <svg
                    className="absolute -bottom-2 -left-10 w-[140%] h-80"
                    viewBox="0 0 800 320"
                    preserveAspectRatio="none"
                    style={{ animation: 'waveMove2 8s ease-in-out infinite' }}
                >
                    <path
                        d="M0 240 Q200 180 400 220 Q600 260 800 200 L800 320 L0 320 Z"
                        fill="rgba(255,255,255,0.10)"
                    />
                </svg>

                {/* Floating circles - Ambient Motion */}
                <div className="absolute left-[10%] top-[15%] h-20 w-20 rounded-full bg-white/10" style={{ animation: 'float 4s ease-in-out infinite' }} />
                <div className="absolute left-[25%] top-[8%] h-8 w-8 rounded-full bg-white/15" style={{ animation: 'float 5s ease-in-out infinite 0.5s' }} />
                <div className="absolute right-[30%] top-[20%] h-14 w-14 rounded-full border-2 border-white/20" style={{ animation: 'float 6s ease-in-out infinite 1s' }} />
                <div className="absolute right-[15%] top-[35%] h-10 w-10 rounded-full bg-[#ffce08]/25" style={{ animation: 'float 4.5s ease-in-out infinite 0.2s' }} />
                <div className="absolute left-[15%] top-[45%] h-6 w-6 rounded-full bg-white/20" style={{ animation: 'float 5.5s ease-in-out infinite 0.8s' }} />
                <div className="absolute right-[40%] top-[12%] h-4 w-4 rounded-full bg-white/25" style={{ animation: 'float 3s ease-in-out infinite 1.5s' }} />
                <div className="absolute left-[40%] top-[30%] h-12 w-12 rounded-full border border-white/15" style={{ animation: 'float 7s ease-in-out infinite 0.4s' }} />
                <div className="absolute right-[20%] top-[55%] h-5 w-5 rounded-full bg-white/15" style={{ animation: 'float 4s ease-in-out infinite 0.6s' }} />
                <div className="absolute left-[8%] top-[65%] h-16 w-16 rounded-full border-2 border-white/10" style={{ animation: 'float 5s ease-in-out infinite 0.3s' }} />

                {/* Small dots - Ambient Pulse */}
                <div className="absolute left-[50%] top-[18%] h-2 w-2 rounded-full bg-white/35" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }} />
                <div className="absolute left-[60%] top-[40%] h-2 w-2 rounded-full bg-white/30" style={{ animation: 'pulse-glow 4s ease-in-out infinite 1s' }} />
                <div className="absolute left-[30%] top-[55%] h-2 w-2 rounded-full bg-[#ffce08]/50" style={{ animation: 'pulse-glow 3s ease-in-out infinite 2s' }} />

                {/* Logo at top - Static */}
                <div className="absolute left-8 top-8 z-10">
                    <Link href="/" className="block">
                        <Image
                            src={trustateLogo}
                            alt="TruState"
                            width={150}
                            height={50}
                            priority
                            className="brightness-0 invert hover:opacity-80 transition-opacity duration-300"
                        />
                    </Link>
                </div>

                {/* Text - bottom left - Static */}
                <div className="absolute bottom-20 left-8 z-10">
                    <p className="mb-2 text-lg text-[#ffce08]">The Transaction Integrity Layer</p>
                    <h1 className="text-4xl font-bold tracking-wide text-white font-[family-name:var(--font-arsenal-sc)]">
                        Trusted Real Estate Platform
                    </h1>
                </div>

                {/* Bottom-right corner curve */}
                <svg
                    className="absolute bottom-0 right-0 z-20"
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                >
                    <path
                        d="M200 0 L200 200 L0 200 Q200 200 200 0"
                        fill="white"
                    />
                </svg>
            </div>

            {/* Right Panel - Static Container */}
            <div className="relative flex w-full items-center justify-center overflow-hidden bg-white p-8 lg:flex-1 lg:-ml-[40px] rounded-tl-[40px] rounded-bl-[40px] z-10">

                {/* Back Button - Top Left */}
                <Link
                    href="/"
                    className="absolute left-8 top-8 z-20 inline-flex items-center gap-2 px-3 py-2 transition-all duration-300 group"
                >
                    <svg
                        className="h-5 w-5 text-gray-400 group-hover:text-[#0247ae] group-hover:-translate-x-0.5 transition-all duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-[#0247ae] transition-colors duration-300">Back</span>
                </Link>

                {/* House and Dotted Trail - Static Background */}
                <svg
                    className="absolute right-0 top-0 h-64 w-full"
                    viewBox="0 0 400 250"
                    fill="none"
                    preserveAspectRatio="xMaxYMin meet"
                >
                    <g transform="translate(147, 100) rotate(-30)">
                        <path
                            d="M14 6L2 16h4v11h5v-7h6v7h5v-11h4L14 6z"
                            fill="#0247ae"
                        />
                    </g>
                    <path
                        d="M185 105 C 260 50, 340 20, 400 25"
                        stroke="#0247ae"
                        strokeWidth="2.5"
                        strokeDasharray="6 6"
                        fill="none"
                        opacity="0.3"
                    />
                </svg>

                {/* Decorative elements - Static */}
                {/* Top left area */}
                <div className="absolute left-[8%] top-[12%] h-16 w-16 rounded-full border-2 border-[#0247ae]/10" />
                <div className="absolute left-[5%] top-[8%] h-3 w-3 rounded-full bg-[#0247ae]/15" />

                {/* Bottom left area */}
                <div className="absolute left-[6%] bottom-[15%] h-20 w-20 rounded-full border border-[#0247ae]/8" />
                <div className="absolute left-[15%] bottom-[10%] h-4 w-4 rounded-full bg-[#ffce08]/20" />
                <div className="absolute left-[3%] bottom-[25%] h-2 w-2 rounded-full bg-[#0247ae]/20" />

                {/* Bottom right area */}
                <div className="absolute right-[8%] bottom-[12%] h-14 w-14 rounded-full border-2 border-[#0247ae]/10" />
                <div className="absolute right-[15%] bottom-[8%] h-3 w-3 rounded-full bg-[#0247ae]/15" />
                <div className="absolute right-[5%] bottom-[22%] h-2 w-2 rounded-full bg-[#ffce08]/25" />

                {/* Middle side accents */}
                <div className="absolute left-[4%] top-[45%] h-6 w-6 rounded-full border border-[#0247ae]/12" />
                <div className="absolute right-[6%] top-[40%] h-8 w-8 rounded-full border border-[#0247ae]/8" />

                {/* Small dots scattered */}
                <div className="absolute left-[12%] top-[30%] h-2 w-2 rounded-full bg-[#0247ae]/12" />
                <div className="absolute right-[12%] bottom-[35%] h-2 w-2 rounded-full bg-[#0247ae]/12" />
                <div className="absolute left-[10%] bottom-[40%] h-1.5 w-1.5 rounded-full bg-[#ffce08]/30" />
                <div className="absolute right-[10%] top-[25%] h-1.5 w-1.5 rounded-full bg-[#ffce08]/25" />

                <LoginForm />
            </div>
        </main>
    );
}
