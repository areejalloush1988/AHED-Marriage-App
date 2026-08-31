import Image from "next/image";

type AhedBrandProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
};

export function AhedBrand({
  alt = "شعار عَهْد",
  className,
  priority = false,
}: AhedBrandProps) {
  return (
    <Image
      alt={alt}
      className={className}
      height={364}
      priority={priority}
      src="/ahed-logo.png"
      width={911}
    />
  );
}
