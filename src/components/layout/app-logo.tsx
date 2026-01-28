export function AppLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-lg"
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
      <path
        d="M9 22V10C9 8.89543 9.89543 8 11 8H21C22.1046 8 23 8.89543 23 10V22L16 19L9 22Z"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V10C9 8.89543 9.89543 8 11 8H13"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
