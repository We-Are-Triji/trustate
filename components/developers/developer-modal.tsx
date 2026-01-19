"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Briefcase,
  X,
  Award,
  Star,
  CheckCircle2,
  Building2,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import type { Developer } from "@/lib/types/developer";

// Logo map using Logo.dev API (same as footer partners)
const logoMap: Record<string, string> = {
  "Ayala Land": "https://img.logo.dev/ayalaland.com.ph?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "SM Development Corporation": "https://img.logo.dev/smdc.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "Megaworld Corporation": "https://img.logo.dev/megaworldcorp.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "Robinsons Land Corporation": "https://img.logo.dev/robinsonsland.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "DMCI Homes": "https://img.logo.dev/dmcihomes.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "Vista Land & Lifescapes": "https://img.logo.dev/vistaland.com.ph?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "Federal Land": "https://img.logo.dev/federalland.ph?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "Alveo Land": "https://img.logo.dev/alveoland.com.ph?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "Shang Properties": "https://img.logo.dev/shangproperties.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "Century Properties": "https://img.logo.dev/century-properties.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "Filinvest Land": "https://img.logo.dev/filinvestland.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  "Rockwell Land": "https://img.logo.dev/rockwellland.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
};

interface DeveloperModalProps {
  developer: Developer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperModal({
  developer,
  isOpen,
  onClose,
}: DeveloperModalProps) {
  // State to track if the logo failed to load
  const [imageError, setImageError] = useState(false);

  // Reset error state when developer changes
  if (developer && imageError) setImageError(false);

  if (!developer) return null;

  const companyLogoUrl = logoMap[developer.name];
  
  // Fallback Avatar (Initials) in case Google Favicon fails or is missing
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(developer.name)}&background=0247ae&color=fff&size=128&font-size=0.33`;

  const tierConfig = {
    gold: {
      gradient: "from-[#ffce08] to-[#f5c000]",
      text: "text-[#0247ae]",
      border: "border-[#ffce08]/50",
      iconColor: "text-[#0247ae]",
    },
    silver: {
      gradient: "from-slate-100 to-slate-300",
      text: "text-slate-800",
      border: "border-slate-200",
      iconColor: "text-slate-600",
    },
    bronze: {
      gradient: "from-orange-100 to-orange-200",
      text: "text-orange-900",
      border: "border-orange-200",
      iconColor: "text-orange-700",
    },
  };

  const config =
    tierConfig[developer.partnerTier as keyof typeof tierConfig] ||
    tierConfig.bronze;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-5xl w-[95vw] h-[90vh] md:h-auto max-h-[95vh] overflow-hidden bg-[#f8faff] p-0 gap-0 rounded-3xl shadow-2xl border-0 flex flex-col md:flex-row ring-1 ring-white/50"
      >
        <VisuallyHidden>
          <DialogTitle>{developer.name} Details</DialogTitle>
        </VisuallyHidden>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-white/80 backdrop-blur-md p-2 text-slate-500 hover:bg-[#0247ae] hover:text-white transition-all border border-slate-200 shadow-sm hover:rotate-90 duration-300"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* --- LEFT COLUMN: "Architectural Minimalist" Design --- */}
        <div className="w-full md:w-[360px] shrink-0 bg-gradient-to-b from-white to-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col overflow-y-auto md:overflow-y-visible relative">
          
          {/* Design Accent: Gradient Line on Left */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#0247ae] via-[#0560d4] to-[#ffce08]" />

          {/* Background Pattern: Subtle Grid */}
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply" 
               style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>

          <div className="px-8 pt-12 pb-8 flex-1 flex flex-col relative z-10">
            
            {/* Logo Container - Clean Floating Card */}
            <div className="mb-8 self-start">
               <div className="h-24 w-24 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center overflow-hidden p-1 group transition-transform duration-500 hover:scale-105">
                  <img 
                    src={imageError ? fallbackAvatar : (companyLogoUrl || fallbackAvatar)}
                    alt={`${developer.name} logo`} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                    onError={() => setImageError(true)}
                  />
               </div>
            </div>

            {/* Partner Badge */}
            <div className={`inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4 border bg-gradient-to-r ${config.gradient} ${config.text} ${config.border} shadow-sm`}>
              <Star className={`h-3 w-3 ${config.iconColor} fill-current`} />
              {developer.partnerTier} Partner
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
              {developer.name}
            </h2>

            <div className="flex items-center gap-2 mb-8 text-slate-500 text-sm font-medium">
              <MapPin className="h-4 w-4 shrink-0 text-[#ffce08]" />
              {developer.city}, {developer.country}
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md hover:border-[#0247ae]/30 transition-all duration-300 group">
                <div className="text-2xl font-black text-[#0247ae] group-hover:scale-110 transition-transform">{developer.projectsCompleted}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Projects</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md hover:border-[#0247ae]/30 transition-all duration-300 group">
                <div className="text-2xl font-black text-[#0247ae] group-hover:scale-110 transition-transform">{developer.yearsInBusiness}+</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Years Exp</div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-5 mb-8">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-[#0247ae] group-hover:rotate-6 transition-all duration-300">
                  <Phone className="h-5 w-5 text-[#0247ae] group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{developer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center shrink-0 group-hover:bg-[#ffce08] group-hover:-rotate-6 transition-all duration-300">
                  <Mail className="h-5 w-5 text-[#f5c000] group-hover:text-[#0247ae] transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <a href={`mailto:${developer.email}`} className="text-sm font-bold text-[#0247ae] hover:underline truncate block">
                    {developer.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Visit Website Button */}
            <div className="mt-auto pt-6 border-t border-slate-200">
              <Button
                asChild
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0247ae] via-[#0560d4] to-[#0247ae] hover:from-[#0560d4] hover:via-[#0247ae] hover:to-[#0560d4] text-white font-bold shadow-lg shadow-blue-900/10 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-500 bg-[length:200%_100%] hover:bg-[length:100%_100%]"
              >
                <a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Visit Official Website
                  <ExternalLink className="h-3 w-3 opacity-70 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Content) --- */}
        <div className="flex-1 min-w-0 bg-white overflow-y-auto relative">
           {/* Background Grid Pattern */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div 
                  className="h-full w-full"
                  style={{
                    backgroundImage: `linear-gradient(#0247ae 1px, transparent 1px), linear-gradient(90deg, #0247ae 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                  }}
                />
            </div>

          <div className="p-8 md:p-10 space-y-10 relative z-10">
            {/* About */}
            <section className="animate-[fadeIn_0.5s_ease-out]">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#0247ae] mb-4">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                   <Briefcase className="h-5 w-5 text-[#0247ae]" />
                </div>
                Company Overview
              </h3>
              <p className="text-slate-600 leading-relaxed text-[15px] font-medium">
                {developer.fullDescription}
              </p>
            </section>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Specializations */}
            <section className="animate-[fadeIn_0.5s_ease-out_0.1s_both]">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#0247ae] mb-5">
                <div className="p-1.5 bg-yellow-50 rounded-lg">
                  <Award className="h-5 w-5 text-[#f5c000]" />
                </div>
                Specializations & Capabilities
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {developer.specializations.map((spec, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-2.5 hover:border-[#ffce08] hover:shadow-md hover:shadow-[#ffce08]/10 transition-all cursor-default"
                  >
                    <CheckCircle2 className="h-4 w-4 text-slate-300 group-hover:text-[#0247ae] transition-colors" />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-[#0247ae]">{spec}</span>
                  </div>
                ))}
              </div>
            </section>

             <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Verification Footer */}
            <div className="bg-gradient-to-br from-[#f8faff] to-white rounded-2xl p-6 border border-blue-50 flex items-start gap-4 animate-[fadeIn_0.5s_ease-out_0.2s_both]">
               <div className="p-3 bg-[#0247ae]/5 rounded-xl shrink-0">
                  <ShieldCheck className="h-6 w-6 text-[#0247ae]" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-[#0247ae] mb-1">Verified Partner Status</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This developer has been verified as a <strong>{developer.partnerTier}</strong> partner. 
                    They have completed {developer.projectsCompleted} projects and maintain a valid business license in {developer.country}.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}