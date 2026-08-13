type IconProps = {
  size?: number;
  className?: string;
};

export function BatIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size * 0.44}
      viewBox="0 0 100 44"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M0 18 L14 8 L27 20 L37 4 L50 16 L63 4 L73 20 L86 8 L100 18 L82 28 L62 24 L50 38 L38 24 L18 28 Z" />
    </svg>
  );
}

function Svg({
  size = 22,
  className,
  children,
  viewBox = "0 0 24 24",
}: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13 4-2 16" />
    </Svg>
  );
}

export function NeuralIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="5" r="2.4" />
      <circle cx="5" cy="19" r="2.4" />
      <circle cx="19" cy="19" r="2.4" />
      <path d="M12 7.4v3.1M5 19v-4.4M19 19v-4.4" />
      <path d="M7.2 14.6 10.7 10.5M16.8 14.6 13.3 10.5" />
    </Svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
    </Svg>
  );
}

export function ServerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5h.01M7 16.5h.01" />
      <path d="M11 7.5h4M11 16.5h4" />
    </Svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg
      width={props.size ?? 22}
      height={props.size ?? 22}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={props.className}
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.72.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.9-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.81c0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg
      width={props.size ?? 22}
      height={props.size ?? 22}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={props.className}
    >
      <path d="M4.98 3.5a2.49 2.49 0 1 1 0 4.98 2.49 2.49 0 0 1 0-4.98ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.57h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.25c0-1.25-.02-2.86-1.74-2.86-1.75 0-2.02 1.37-2.02 2.78V21h-4V9.5Z" />
    </svg>
  );
}

export function HackerrankIcon(props: IconProps) {
  return (
    <svg
      width={props.size ?? 22}
      height={props.size ?? 22}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={props.className}
    >
      <path d="M12 2 2.8 6.9v10.2L12 22l9.2-4.9V6.9L12 2Zm-1.1 6.1h1.5v2h1.7v1.5h-1.7v2.1h1.7v1.5h-3.2a.6.6 0 0 1-.6-.6V7.5a.6.6 0 0 1 .6-.4Zm3.4 9.2h-1.5v-2h-1.7v-1.5h1.7v-2.1h-1.7v-1.5h3.2a.6.6 0 0 1 .6.6v9.5a.6.6 0 0 1-.6 0Z" />
    </svg>
  );
}

export function VolumeIcon({ muted = false, ...props }: IconProps & { muted?: boolean }) {
  return (
    <Svg {...props}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      {muted ? (
        <>
          <path d="m16 9 5 5M21 9l-5 5" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.4 6a9 9 0 0 1 0 12" />
        </>
      )}
    </Svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 13.2A8.2 8.2 0 1 1 10.8 4a6.6 6.6 0 0 0 9.2 9.2Z" />
    </Svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M19.2 4.8l-1.6 1.6M6.4 17.6l-1.6 1.6" />
    </Svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </Svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 4h6v6" />
      <path d="M10 14 20 4" />
      <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
    </Svg>
  );
}
