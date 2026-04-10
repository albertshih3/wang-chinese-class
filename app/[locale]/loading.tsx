import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center space-y-6 animate-fade-in">
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Faded Background Character */}
        <span className="absolute text-[80px] font-serif text-primary/10 select-none">
          王
        </span>
        
        {/* Animated Foreground Character */}
        <span 
          className="absolute text-[80px] font-serif text-primary select-none animate-char-fill"
          aria-hidden="true"
        >
          王
        </span>
      </div>
      
      {/* Optional pulsing border/ring for extra flair */}
      <div className="absolute h-32 w-32 rounded-full border border-primary/20 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
    </div>
  );
}
