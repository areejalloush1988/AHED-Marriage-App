import Image from "next/image";

type AhedBrandProps = {
  alt?: string;
  className?: string;
  locale?: "ar" | "en";
  priority?: boolean;
};

/**
 * Canonical AHED lockup: burgundy Arabic wordmark with the open-book mark and
 * the approved warm polished-gold finish.
 */
export function AhedBrand({
  alt,
  className,
  locale = "ar",
  priority = false,
}: AhedBrandProps) {
  const isEnglish = locale === "en";

  return (
    <Image
      alt={alt ?? (isEnglish ? "AHED logo" : "شعار عَهْد")}
      className={className}
      height={isEnglish ? 693 : 1835}
      priority={priority}
      src={
        isEnglish
          ? "/ahed-logo-en.webp?v=20260902-en-gold"
          : "/ahed-logo.webp?v=20260902-hd-gold"
      }
      width={isEnglish ? 1600 : 4096}
    />
  );
}
