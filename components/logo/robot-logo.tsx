export default function RobotLogo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Robot Head */}
      <rect
        x="20"
        y="15"
        width="60"
        height="50"
        rx="8"
        fill="url(#headGradient)"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Left Eye */}
      <circle cx="35" cy="30" r="6" fill="white" />
      <circle cx="35" cy="30" r="3" fill="#1e40af" />

      {/* Right Eye */}
      <circle cx="65" cy="30" r="6" fill="white" />
      <circle cx="65" cy="30" r="3" fill="#1e40af" />

      {/* Smile */}
      <path d="M 40 45 Q 50 52 60 45" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Robot Body */}
      <rect
        x="25"
        y="65"
        width="50"
        height="25"
        rx="4"
        fill="url(#bodyGradient)"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Left Arm */}
      <rect
        x="10"
        y="70"
        width="15"
        height="8"
        rx="4"
        fill="url(#armGradient)"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Right Arm */}
      <rect
        x="75"
        y="70"
        width="15"
        height="8"
        rx="4"
        fill="url(#armGradient)"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Book in hand */}
      <rect x="78" y="60" width="12" height="15" rx="2" fill="#dc2626" stroke="currentColor" strokeWidth="1" />
      <line x1="80" y1="60" x2="80" y2="75" stroke="white" strokeWidth="0.5" />
      <line x1="82" y1="60" x2="82" y2="75" stroke="white" strokeWidth="0.5" />
      <line x1="84" y1="60" x2="84" y2="75" stroke="white" strokeWidth="0.5" />

      {/* Gradients */}
      <defs>
        <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="armGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  )
}
