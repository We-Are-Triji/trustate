"use client";

import { Mail, Phone, Star, MapPin, Award, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AgentProfile } from "@/lib/types/agent";

interface AgentCardProps {
  agent: AgentProfile;
  onViewDetails?: (agentId: string) => void;
}

// Professional stock photos - expanded pool to avoid repeats (20 each)
const malePhotos = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca44?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face",
];

const femalePhotos = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1557296387-5358ad7997bb?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face",
];

// Common male and female first names for gender detection
const maleNames = ['john', 'michael', 'david', 'james', 'robert', 'william', 'richard', 'joseph', 'thomas', 'charles', 'daniel', 'matthew', 'mark', 'paul', 'steven', 'andrew', 'kenneth', 'joshua', 'kevin', 'brian', 'george', 'edward', 'ronald', 'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon', 'benjamin', 'samuel', 'raymond', 'gregory', 'frank', 'alexander', 'patrick', 'jack', 'dennis', 'jerry', 'tyler', 'aaron', 'jose', 'adam', 'henry', 'nathan', 'douglas', 'zachary', 'peter', 'kyle', 'walter', 'ethan', 'jeremy', 'harold', 'keith', 'christian', 'roger', 'noah', 'gerald', 'carl', 'terry', 'sean', 'austin', 'arthur', 'lawrence', 'jesse', 'dylan', 'bryan', 'joe', 'jordan', 'billy', 'bruce', 'albert', 'willie', 'gabriel', 'logan', 'alan', 'juan', 'wayne', 'roy', 'ralph', 'randy', 'eugene', 'vincent', 'russell', 'elijah', 'louis', 'bobby', 'philip', 'johnny', 'carlos', 'roberto', 'paolo', 'miguel', 'pedro', 'luis', 'fernando', 'ricardo', 'antonio', 'manuel', 'francisco', 'javier', 'rafael', 'diego', 'sergio', 'eduardo', 'alberto', 'jorge', 'ramon', 'cesar', 'raul'];

const femaleNames = ['mary', 'patricia', 'jennifer', 'linda', 'barbara', 'elizabeth', 'susan', 'jessica', 'sarah', 'karen', 'nancy', 'lisa', 'betty', 'margaret', 'sandra', 'ashley', 'kimberly', 'emily', 'donna', 'michelle', 'dorothy', 'carol', 'amanda', 'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon', 'laura', 'cynthia', 'kathleen', 'amy', 'angela', 'shirley', 'anna', 'brenda', 'pamela', 'emma', 'nicole', 'helen', 'samantha', 'katherine', 'christine', 'debra', 'rachel', 'carolyn', 'janet', 'catherine', 'maria', 'heather', 'diane', 'ruth', 'julie', 'olivia', 'joyce', 'virginia', 'victoria', 'kelly', 'lauren', 'christina', 'joan', 'evelyn', 'judith', 'megan', 'andrea', 'cheryl', 'hannah', 'jacqueline', 'martha', 'gloria', 'teresa', 'ann', 'sara', 'madison', 'frances', 'kathryn', 'janice', 'jean', 'abigail', 'alice', 'judy', 'sophia', 'grace', 'denise', 'amber', 'doris', 'marilyn', 'danielle', 'beverly', 'isabella', 'theresa', 'diana', 'natalie', 'brittany', 'charlotte', 'marie', 'kayla', 'alexis', 'lori', 'carmen', 'rosa', 'elena', 'lucia', 'isabel', 'clara', 'sofia', 'valentina', 'gabriela', 'adriana', 'veronica', 'beatriz', 'cristina', 'monica', 'ana'];

// Generate professional photo based on agent name and gender
// Uses consistent hashing to ensure same agent always gets same photo
function getAgentPhoto(name: string): string {
  const firstName = name.split(' ')[0].toLowerCase();
  const isMale = maleNames.includes(firstName);
  const isFemale = femaleNames.includes(firstName);
  
  // Create a more robust hash from the full name to ensure consistency
  // This ensures the same name always produces the same hash value
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Make hash positive
  hash = Math.abs(hash);
  
  if (isFemale) {
    // Use female photos for detected female names
    const photoIndex = hash % femalePhotos.length;
    return femalePhotos[photoIndex];
  } else if (isMale) {
    // Use male photos for detected male names
    const photoIndex = hash % malePhotos.length;
    return malePhotos[photoIndex];
  } else {
    // For unknown names, use a mix based on hash
    const useFemaleFallback = hash % 2 === 0;
    if (useFemaleFallback) {
      const photoIndex = hash % femalePhotos.length;
      return femalePhotos[photoIndex];
    } else {
      const photoIndex = hash % malePhotos.length;
      return malePhotos[photoIndex];
    }
  }
}

function getStatusColor(status: AgentProfile["status"]) {
  switch (status) {
    case "active":
      return "bg-emerald-500";
    case "inactive":
      return "bg-gray-400";
    case "invited":
      return "bg-amber-500";
    default:
      return "bg-gray-400";
  }
}

function getStatusLabel(status: AgentProfile["status"]) {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "invited":
      return "Invited";
    default:
      return status;
  }
}

function getCategoryLabel(category: AgentProfile["category"]) {
  switch (category) {
    case "managerial":
      return "Managerial";
    case "non-management":
      return "Non-Management";
    default:
      return category;
  }
}

function getEmploymentLabel(type: AgentProfile["employmentType"]) {
  switch (type) {
    case "fulltime":
      return "Fulltime";
    case "part-time":
      return "Part-time";
    case "contract":
      return "Contract";
    default:
      return type;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Export the photo function so it can be used in other components
export { getAgentPhoto };

export function AgentCard({ agent, onViewDetails }: AgentCardProps) {
  const photoUrl = getAgentPhoto(agent.name);
  
  return (
    <Card className="group overflow-hidden rounded-2xl md:rounded-3xl border-0 bg-white shadow-lg transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(2,71,174,0.35)] hover:-translate-y-3 p-0 gap-0">
      <CardContent className="p-0 relative m-0">
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 rounded-2xl md:rounded-3xl"></div>
        
        {/* Card header with gradient */}
        <div className="relative bg-gradient-to-br from-[#0247ae] via-[#0560d4] to-[#0873c9] h-24 md:h-36 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white -translate-y-1/2 translate-x-1/2 animate-[float_6s_ease-in-out_infinite]" />
            <div className="absolute left-0 bottom-0 h-36 w-36 rounded-full bg-white/50 translate-y-1/2 -translate-x-1/2 animate-[float_5s_ease-in-out_infinite_1s]" />
          </div>
          
          {/* Decorative dots pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="h-full w-full"
              style={{
                backgroundImage: `radial-gradient(circle, white 1.5px, transparent 1.5px)`,
                backgroundSize: '24px 24px'
              }}
            />
          </div>
          
          {/* Status badge - top left */}
          <div className="absolute left-2 md:left-4 top-2 md:top-4 z-10">
            <div className="flex items-center gap-1.5 md:gap-2 rounded-lg md:rounded-xl bg-white/95 backdrop-blur-md px-2 md:px-3.5 py-1 md:py-2 shadow-lg border border-white/50">
              <span className={`h-1.5 md:h-2 w-1.5 md:w-2 rounded-full ${getStatusColor(agent.status)} ${agent.status === 'active' ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] md:text-xs font-extrabold text-gray-800">{getStatusLabel(agent.status)}</span>
            </div>
          </div>
          
          {/* Rating badge - top right */}
          <div className="absolute right-2 md:right-4 top-2 md:top-4 z-10">
            <div className="flex items-center gap-1.5 md:gap-2 rounded-lg md:rounded-xl bg-gradient-to-r from-[#ffce08] to-[#f5c000] px-2 md:px-3.5 py-1 md:py-2 shadow-lg border border-yellow-300/50">
              <Star className="h-3 md:h-4 w-3 md:w-4 fill-white text-white" />
              <span className="text-[10px] md:text-xs font-extrabold text-[#0247ae]">{agent.rating}</span>
            </div>
          </div>
        </div>

        {/* Profile image - overlapping header */}
        <div className="relative -mt-12 md:-mt-20 flex justify-center px-4 md:px-6">
          <div className="relative">
            <div className="h-24 w-24 md:h-36 md:w-36 rounded-2xl md:rounded-3xl border-[3px] md:border-[5px] border-white shadow-2xl overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_25px_50px_-12px_rgba(2,71,174,0.4)] group-hover:border-[#ffce08]">
              <img 
                src={photoUrl} 
                alt={agent.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&size=400&background=0247ae&color=fff&bold=true`;
                }}
              />
            </div>
            {/* Online indicator */}
            {agent.status === "active" && (
              <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 h-6 w-6 md:h-9 md:w-9 rounded-full border-[2px] md:border-[3px] border-white bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-xl">
                <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-emerald-400 animate-ping absolute" />
                <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-white relative" />
              </div>
            )}
          </div>
        </div>

        {/* Agent info */}
        <div className="px-3 md:px-6 pb-3 md:pb-6 pt-4 md:pt-8">
          {/* Name and title */}
          <div className="text-center mb-3 md:mb-5">
            <h3 className="text-base md:text-xl font-extrabold text-gray-900 mb-1 md:mb-1.5 group-hover:text-[#0247ae] transition-colors duration-300 leading-tight">{agent.name}</h3>
            <p className="text-xs md:text-sm font-bold bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent mb-1 md:mb-1.5">{agent.title}</p>
            <p className="text-[10px] md:text-xs text-gray-500 font-semibold">{agent.employeeCode}</p>
          </div>
          
          {/* Location */}
          <div className="flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600 mb-3 md:mb-5 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gray-50 border border-gray-100">
            <MapPin className="h-3 md:h-4 w-3 md:w-4 text-[#0247ae]" />
            <span className="font-bold">{agent.location}</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-5">
            <div className="text-center p-2 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 transition-all duration-300 hover:border-blue-200 hover:shadow-md">
              <div className="flex items-center justify-center gap-1 md:gap-1.5 mb-1 md:mb-1.5">
                <Award className="h-3 md:h-4 w-3 md:w-4 text-[#0247ae]" />
                <p className="text-[10px] md:text-xs font-bold text-gray-600">Reviews</p>
              </div>
              <p className="text-base md:text-xl font-extrabold text-[#0247ae]">{agent.reviewCount}</p>
            </div>
            <div className="text-center p-2 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100 transition-all duration-300 hover:border-yellow-200 hover:shadow-md">
              <div className="flex items-center justify-center gap-1 md:gap-1.5 mb-1 md:mb-1.5">
                <TrendingUp className="h-3 md:h-4 w-3 md:w-4 text-[#ffce08]" />
                <p className="text-[10px] md:text-xs font-bold text-gray-600">Rating</p>
              </div>
              <p className="text-base md:text-xl font-extrabold text-[#ffce08]">{agent.rating}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mb-3 md:mb-5">
            <span className="rounded-lg md:rounded-xl bg-gradient-to-r from-[#0247ae]/10 to-[#0560d4]/10 px-2 md:px-4 py-1 md:py-2 text-[10px] md:text-xs font-extrabold text-[#0247ae] border-2 border-[#0247ae]/20 whitespace-nowrap">
              {getCategoryLabel(agent.category)}
            </span>
            <span className="rounded-lg md:rounded-xl bg-gray-100 px-2 md:px-4 py-1 md:py-2 text-[10px] md:text-xs font-extrabold text-gray-700 border-2 border-gray-200 whitespace-nowrap">
              {getEmploymentLabel(agent.employmentType)}
            </span>
          </div>

          {/* Contact info */}
          <div className="space-y-2 md:space-y-3 mb-3 md:mb-6 p-2.5 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100">
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs">
              <div className="flex-shrink-0 h-7 w-7 md:h-9 md:w-9 rounded-lg md:rounded-xl bg-blue-100 flex items-center justify-center">
                <Mail className="h-3 w-3 md:h-4 md:w-4 text-[#0247ae]" />
              </div>
              <a
                href={`mailto:${agent.email}`}
                className="flex-1 truncate text-gray-700 hover:text-[#0247ae] font-bold transition-colors"
              >
                {agent.email}
              </a>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs">
              <div className="flex-shrink-0 h-7 w-7 md:h-9 md:w-9 rounded-lg md:rounded-xl bg-green-100 flex items-center justify-center">
                <Phone className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
              </div>
              <span className="text-gray-700 font-bold">{agent.phone}</span>
            </div>
          </div>

          {/* View details button */}
          <Button 
            onClick={() => onViewDetails?.(agent.id)}
            className="w-full rounded-xl md:rounded-2xl bg-gradient-to-r from-[#0247ae] to-[#0560d4] hover:from-[#0560d4] hover:to-[#0247ae] font-extrabold h-10 md:h-14 text-sm md:text-base shadow-lg shadow-[#0247ae]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#0247ae]/50 hover:scale-[1.02] relative overflow-hidden group/btn"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
            <span className="relative">View Full Profile</span>
          </Button>
          
          <p className="mt-2 md:mt-4 text-center text-[10px] md:text-xs text-gray-500 font-semibold">
            Member since {formatDate(agent.joinedDate)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
