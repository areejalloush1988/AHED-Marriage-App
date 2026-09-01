import Image from "next/image";

type AhedBrandProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Canonical AHED lockup: burgundy Arabic wordmark with the open-book mark and
 * the approved warm polished-gold finish.
 */
export function AhedBrand({
  alt = "شعار عَهْد",
  className,
  priority = false,
}: AhedBrandProps) {
  return (
    <Image
      alt={alt}
      className={className}
      height={841}
      priority={priority}
      src="/ahed-logo.webp"
      width={1870}
    />
  );
}
