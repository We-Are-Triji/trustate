import { LoginForm } from "@/components/auth/login/login-form";
import Image from "next/image";
import trustateLogo from "@/app/assets/trustate.png";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-[#0247ae]">
      {/* Left Panel - Wave design with floating elements */}
      <div 
        className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col animate-[slideInLeft_0.8s_cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: 'linear-gradient(120deg, #0247ae 0%, #0873c9 20%, #0247ae 40%, #0873c9 60%, #0247ae 80%, #0873c9 100%)',
          backgroundSize: '300% 100%',
          animation: 'slideInLeft 0.8s cubic-bezier(0.16,1,0.3,1), waveGradient 30s ease-in-out infinite 0.8s'
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

        {/* Bottom waves with animation - more visible and moving */}
        <svg 
          className="absolute -bottom-2 -left-20 w-[150%] h-80" 
          viewBox="0 0 800 320" 
          preserveAspectRatio="none"
          style={{ animation: 'waveMove 4s ease-in-out infinite' }}
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
          style={{ animation: 'waveMove2 5s ease-in-out infinite' }}
        >
          <path
            d="M0 240 Q200 180 400 220 Q600 260 800 200 L800 320 L0 320 Z"
            fill="rgba(255,255,255,0.10)"
          />
        </svg>

        {/* Floating circles with animations - faster */}
        <div className="absolute left-[10%] top-[15%] h-20 w-20 rounded-full bg-white/10 animate-[float_3s_ease-in-out_infinite]" />
        <div className="absolute left-[25%] top-[8%] h-8 w-8 rounded-full bg-white/15 animate-[float_2.5s_ease-in-out_infinite_0.3s]" />
        <div className="absolute right-[30%] top-[20%] h-14 w-14 rounded-full border-2 border-white/20 animate-[float_3.5s_ease-in-out_infinite_0.5s]" />
        <div className="absolute right-[15%] top-[35%] h-10 w-10 rounded-full bg-[#ffce08]/25 animate-[float_4s_ease-in-out_infinite_0.2s]" />
        <div className="absolute left-[15%] top-[45%] h-6 w-6 rounded-full bg-white/20 animate-[float_2.5s_ease-in-out_infinite_0.8s]" />
        <div className="absolute right-[40%] top-[12%] h-4 w-4 rounded-full bg-white/25 animate-[float_3s_ease-in-out_infinite_1s]" />
        <div className="absolute left-[40%] top-[30%] h-12 w-12 rounded-full border border-white/15 animate-[float_3.5s_ease-in-out_infinite_0.4s]" />
        <div className="absolute right-[20%] top-[55%] h-5 w-5 rounded-full bg-white/15 animate-[float_2.5s_ease-in-out_infinite_0.6s]" />
        <div className="absolute left-[8%] top-[65%] h-16 w-16 rounded-full border-2 border-white/10 animate-[float_4s_ease-in-out_infinite_0.3s]" />

        {/* Small dots with animations - faster */}
        <div className="absolute left-[50%] top-[18%] h-2 w-2 rounded-full bg-white/35 animate-[pulse_1.5s_ease-in-out_infinite]" />
        <div className="absolute left-[60%] top-[40%] h-2 w-2 rounded-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
        <div className="absolute left-[30%] top-[55%] h-2 w-2 rounded-full bg-[#ffce08]/50 animate-[pulse_1.5s_ease-in-out_infinite_0.5s]" />

        {/* Logo at top */}
        <div className="absolute left-8 top-8 z-10 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
          <Image
            src={trustateLogo}
            alt="TruState"
            width={150}
            height={50}
            priority
            className="brightness-0 invert"
          />
        </div>

        {/* Text - bottom left */}
        <div className="absolute bottom-20 left-8 z-10">
          <p className="mb-2 text-lg text-[#ffce08] animate-[fadeInUp_0.6s_ease-out_0.5s_both]">The Transaction Integrity Layer</p>
          <h1 className="text-4xl font-bold tracking-wide text-white font-[family-name:var(--font-arsenal-sc)] animate-[fadeInUp_0.6s_ease-out_0.6s_both]">
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

{/* Right Panel - Login Form */}
<div className="relative flex w-full items-center justify-center overflow-hidden bg-white p-8 lg:flex-1 lg:-ml-[40px] rounded-tl-[40px] rounded-bl-[40px] z-10 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
  
  {/* House and Dotted Trail */}
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

  {/* Decorative elements - balanced positioning */}
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
