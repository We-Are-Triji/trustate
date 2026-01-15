export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #0247ae 0%, #0873c9 20%, #0247ae 40%, #0873c9 60%, #0247ae 80%, #0873c9 100%)",
        backgroundSize: "300% 100%",
        animation: "waveGradient 30s ease-in-out infinite",
      }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Waves */}
      <svg className="absolute -bottom-2 -left-20 w-[150%] h-80" viewBox="0 0 800 320" preserveAspectRatio="none" style={{ animation: "waveMove 4s ease-in-out infinite" }}>
        <path d="M0 200 Q200 120 400 170 Q600 220 800 150 L800 320 L0 320 Z" fill="rgba(255,255,255,0.15)" />
      </svg>
      <svg className="absolute -bottom-2 -left-10 w-[140%] h-80" viewBox="0 0 800 320" preserveAspectRatio="none" style={{ animation: "waveMove2 5s ease-in-out infinite" }}>
        <path d="M0 240 Q200 180 400 220 Q600 260 800 200 L800 320 L0 320 Z" fill="rgba(255,255,255,0.10)" />
      </svg>

      {/* Floating circles */}
      <div className="absolute left-[10%] top-[15%] h-20 w-20 rounded-full bg-white/10 animate-[float_3s_ease-in-out_infinite]" />
      <div className="absolute left-[25%] top-[8%] h-8 w-8 rounded-full bg-white/15 animate-[float_2.5s_ease-in-out_infinite_0.3s]" />
      <div className="absolute right-[30%] top-[20%] h-14 w-14 rounded-full border-2 border-white/20 animate-[float_3.5s_ease-in-out_infinite_0.5s]" />
      <div className="absolute right-[15%] top-[35%] h-10 w-10 rounded-full bg-[#ffce08]/25 animate-[float_4s_ease-in-out_infinite_0.2s]" />
      <div className="absolute left-[15%] top-[45%] h-6 w-6 rounded-full bg-white/20 animate-[float_2.5s_ease-in-out_infinite_0.8s]" />
      <div className="absolute right-[40%] top-[12%] h-4 w-4 rounded-full bg-white/25 animate-[float_3s_ease-in-out_infinite_1s]" />
      <div className="absolute left-[40%] top-[30%] h-12 w-12 rounded-full border border-white/15 animate-[float_3.5s_ease-in-out_infinite_0.4s]" />
      <div className="absolute right-[20%] top-[55%] h-5 w-5 rounded-full bg-white/15 animate-[float_2.5s_ease-in-out_infinite_0.6s]" />
      <div className="absolute left-[8%] top-[65%] h-16 w-16 rounded-full border-2 border-white/10 animate-[float_4s_ease-in-out_infinite_0.3s]" />
      <div className="absolute right-[8%] top-[70%] h-12 w-12 rounded-full bg-white/10 animate-[float_3s_ease-in-out_infinite_0.7s]" />
      <div className="absolute left-[60%] top-[60%] h-8 w-8 rounded-full border border-white/20 animate-[float_3.5s_ease-in-out_infinite_0.9s]" />

      {/* Small dots */}
      <div className="absolute left-[50%] top-[18%] h-2 w-2 rounded-full bg-white/35 animate-[pulse_1.5s_ease-in-out_infinite]" />
      <div className="absolute left-[60%] top-[40%] h-2 w-2 rounded-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
      <div className="absolute left-[30%] top-[55%] h-2 w-2 rounded-full bg-[#ffce08]/50 animate-[pulse_1.5s_ease-in-out_infinite_0.5s]" />
      <div className="absolute right-[25%] top-[65%] h-2 w-2 rounded-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite_0.7s]" />
    </div>
  );
}
