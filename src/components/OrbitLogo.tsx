
/**
 * OrbitLogo Component
 * 
 * Purpose:
 * Renders the premium OrbitAdmin brand logo featuring the orbit/ring concept.
 * 
 * Props:
 * @param size Icon sizing in pixels (default: 32)
 * @param showText Whether to render the 'OrbitAdmin' textual brand name (default: false)
 * @param textColor Color style for the brand name (default: 'text-[#11191f] dark:text-white')
 */
export interface OrbitLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export default function OrbitLogo({ size = 32, showText = false, textColor = 'text-[#11191f] dark:text-white' }: OrbitLogoProps) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Orbit Ring SVG */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <radialGradient id="logoSphere" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#818cf8"/>
            <stop offset="60%" stopColor="#4f46e5"/>
            <stop offset="100%" stopColor="#312e81"/>
          </radialGradient>
          <linearGradient id="logoRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="#4f46e5" fillOpacity="0.06"/>
        <circle cx="50" cy="50" r="18" fill="url(#logoSphere)"/>
        <ellipse 
          cx="50" 
          cy="50" 
          rx="35" 
          ry="10" 
          stroke="url(#logoRing)" 
          strokeWidth="5" 
          transform="rotate(-30 50 50)"
        />
        <circle cx="21" cy="33" r="5" fill="#22d3ee"/>
        <circle cx="79" cy="67" r="3.5" fill="#a855f7"/>
      </svg>

      {/* Brand Text */}
      {showText && (
        <span className={`text-xl font-extrabold tracking-tight ${textColor}`}>
          Orbit<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Admin</span>
        </span>
      )}
    </div>
  );
}
