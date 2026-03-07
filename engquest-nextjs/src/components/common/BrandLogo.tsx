// Shared LingoLoot brand mark component used in navigation and marketing surfaces.
import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  logoSrc?: string;
  alt?: string;
  fallback?: string;
  size?: number;
};

const DEFAULT_LOGO_SRC = "/logo.png";

export default function BrandLogo({
  className = "",
  logoSrc = DEFAULT_LOGO_SRC,
  alt = "LingoLoot",
  fallback = "LL",
  size = 40,
}: BrandLogoProps) {
  const hasLogo = Boolean(logoSrc);

  return (
    <span className={className}>
      {hasLogo ? (
        <Image
          src={logoSrc}
          alt={alt}
          width={size}
          height={size}
          sizes={`${size}px`}
          className="h-full w-full rounded-xl object-contain"
        />
      ) : (
        fallback
      )}
    </span>
  );
}
