import { useId } from "react";
export function Lotus({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="2">
        <path d="M32 49C10 47 8 31 12 23c12 0 20 13 20 26ZM32 49c22-2 24-18 20-26-12 0-20 13-20 26Z" />
        <path d="M32 49C16 33 23 19 32 10c9 9 16 23 0 39Z" />
        <path d="M9 45c12 12 34 12 46 0" />
      </g>
    </svg>
  );
}
export default function GardenArt() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="garden-art"
      viewBox="0 0 600 460"
      role="img"
      aria-label="A tranquil illustrated garden with a sun, archway, rolling hills and leafy branches"
    >
      <defs>
        <linearGradient id={`${id}sky`} x2="0" y2="1">
          <stop stopColor="#c7d9bf" />
          <stop offset="1" stopColor="#ecedd4" />
        </linearGradient>
        <clipPath id={`${id}arch`}>
          <path d="M130 420V185a170 170 0 0 1 340 0v235Z" />
        </clipPath>
      </defs>
      <path
        d="M112 420V185a188 188 0 0 1 376 0v235"
        fill="none"
        stroke="#c6d5b3"
        strokeWidth="1"
      />
      <g clipPath={`url(#${id}arch)`}>
        <path
          d="M130 420V185a170 170 0 0 1 340 0v235Z"
          fill={`url(#${id}sky)`}
        />
        <circle cx="327" cy="144" r="52" fill="#faf5ce" />
        <path d="M80 320Q190 175 300 280T550 235V460H80" fill="#a6bca2" />
        <path d="M80 360Q210 260 340 325T550 300V460H80" fill="#6f957f" />
        <path d="M140 400Q260 320 450 355Q300 370 230 460H140" fill="#d7dfbe" />
        <path d="M160 418Q300 320 530 405V460H160" fill="#3a6c59" />
        <path
          d="M185 410Q295 369 419 378M215 423Q310 392 450 401"
          stroke="#96b29a"
          fill="none"
          strokeWidth="1"
        />
      </g>
      <g stroke="#325c45" strokeWidth="2" fill="#698d62">
        <path d="M95 435Q140 300 71 178" fill="none" />
        <path d="M92 246Q40 236 49 194q40 6 43 52ZM104 290q-50-6-57-45 42-6 57 45ZM111 333q-48 3-64-30 40-14 64 30ZM100 380q-46 7-62-20 30-18 62 20ZM101 273q38-34 21-64-33 16-21 64ZM111 321q42-26 35-60-36 7-35 60ZM108 363q42-17 42-48-37 1-42 48Z" />
      </g>
      <g stroke="#416b4f" strokeWidth="2" fill="#90a776">
        <path d="M482 435q-7-108 64-175" fill="none" />
        <path d="M496 356q-38-24-27-55 34 9 27 55ZM487 393q-43-12-42-43 39-2 42 43ZM511 324q-22-34-4-57 29 21 4 57ZM498 359q40-1 50-30-37-12-50 30ZM486 401q43 6 59-21-33-19-59 21Z" />
      </g>
      <g fill="#d8c7a4">
        <ellipse cx="332" cy="433" rx="67" ry="14" />
        <ellipse cx="327" cy="416" rx="45" ry="13" />
        <ellipse cx="335" cy="398" rx="30" ry="12" />
      </g>
      <g fill="none" stroke="#668368">
        <path d="m208 157 7-5 7 5m187 63 6-4 6 4" />
        <circle cx="85" cy="121" r="4" />
        <circle cx="500" cy="151" r="3" />
      </g>
    </svg>
  );
}
