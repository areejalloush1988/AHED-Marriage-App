import Image from "next/image";

type AhedBrandProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
};

type AhedWordmarkProps = {
  className?: string;
};

type AhedOfficialMarkProps = {
  className?: string;
  idSuffix: string;
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

export function AhedOfficialMark({
  className,
  idSuffix,
}: AhedOfficialMarkProps) {
  const alphaFilterId = `ahed-official-alpha-${idSuffix}`;
  const ribbonFilterId = `ahed-official-ribbon-${idSuffix}`;
  const markMaskId = `ahed-official-mask-${idSuffix}`;
  const ribbonMaskId = `ahed-official-ribbon-mask-${idSuffix}`;
  const ribbonClipId = `ahed-official-ribbon-clip-${idSuffix}`;
  const goldGradientId = `ahed-official-gold-${idSuffix}`;
  const ribbonGradientId = `ahed-official-rose-${idSuffix}`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 1024 1536"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id={alphaFilterId}
          x="-4%"
          y="-4%"
          width="108%"
          height="108%"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix type="luminanceToAlpha" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncA type="linear" slope="3.5" intercept="-0.12" />
          </feComponentTransfer>
        </filter>
        <filter
          id={ribbonFilterId}
          x="-4%"
          y="-4%"
          width="108%"
          height="108%"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    2 -3 0 0 0.05"
          />
          <feComponentTransfer>
            <feFuncA type="linear" slope="1.45" intercept="-0.04" />
          </feComponentTransfer>
        </filter>
        <mask
          id={markMaskId}
          x="0"
          y="0"
          width="1024"
          height="1536"
          maskUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
        >
          <image
            filter={`url(#${alphaFilterId})`}
            height="1536"
            href="/ahed-logo-official.png"
            width="1024"
          />
        </mask>
        <mask
          id={ribbonMaskId}
          x="0"
          y="0"
          width="1024"
          height="1120"
          maskUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
        >
          <image
            filter={`url(#${ribbonFilterId})`}
            height="1536"
            href="/ahed-logo-official.png"
            width="1024"
          />
        </mask>
        <clipPath id={ribbonClipId}>
          <rect width="1024" height="1120" />
        </clipPath>
        <linearGradient id={goldGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b7791f" />
          <stop offset="0.22" stopColor="#ffe7a1" />
          <stop offset="0.48" stopColor="#d49a2f" />
          <stop offset="0.72" stopColor="#fff0bd" />
          <stop offset="1" stopColor="#a96913" />
        </linearGradient>
        <linearGradient id={ribbonGradientId} x1="0" y1="0" x2="1" y2="0.9">
          <stop offset="0" stopColor="#f1c0aa" />
          <stop offset="0.44" stopColor="#bf6170" />
          <stop offset="0.72" stopColor="#f0ad9f" />
          <stop offset="1" stopColor="#9d3d54" />
        </linearGradient>
      </defs>
      <rect
        width="1024"
        height="1536"
        fill={`url(#${goldGradientId})`}
        mask={`url(#${markMaskId})`}
      />
      <rect
        width="1024"
        height="1120"
        clipPath={`url(#${ribbonClipId})`}
        fill={`url(#${ribbonGradientId})`}
        mask={`url(#${ribbonMaskId})`}
      />
    </svg>
  );
}

export function AhedWordmark({ className }: AhedWordmarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 620 364"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="ahed-wordmark-alpha"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix type="luminanceToAlpha" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncA type="linear" slope="1.45" intercept="-0.12" />
          </feComponentTransfer>
        </filter>
        <mask
          id="ahed-wordmark-mask"
          x="0"
          y="0"
          width="620"
          height="364"
          maskUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
        >
          <image
            filter="url(#ahed-wordmark-alpha)"
            height="364"
            href="/ahed-logo.png"
            preserveAspectRatio="none"
            width="911"
            x="0"
            y="0"
          />
        </mask>
        <linearGradient id="ahed-wordmark-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b77b22" />
          <stop offset="0.32" stopColor="#f7e4a5" />
          <stop offset="0.56" stopColor="#d5a64a" />
          <stop offset="0.76" stopColor="#fff0bb" />
          <stop offset="1" stopColor="#b77b22" />
          <animate
            attributeName="x1"
            dur="5.2s"
            repeatCount="indefinite"
            values="-0.35;0.25;-0.35"
          />
          <animate
            attributeName="x2"
            dur="5.2s"
            repeatCount="indefinite"
            values="0.65;1.25;0.65"
          />
        </linearGradient>
      </defs>
      <rect
        width="620"
        height="364"
        fill="url(#ahed-wordmark-gold)"
        mask="url(#ahed-wordmark-mask)"
      />
    </svg>
  );
}
