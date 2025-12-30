"use client";

// Status colors from spec
export const STATUS_COLORS = {
  open: "#30D158",
  closingSoon: "#30D158", // Base is green, badge is yellow
  closingSoonBadge: "#FFD60A",
  closed: "#FF453A",
  closing: "#FF453A",
  opening: "#FFD60A",
  construction: "#FF453A",
  unknown: "#98989D",
} as const;

/**
 * Get the primary color for a bridge status
 */
export function getStatusIconColor(status: string): string {
  switch (status) {
    case "open":
    case "closingSoon":
      return STATUS_COLORS.open;
    case "closed":
    case "closing":
    case "construction":
      return STATUS_COLORS.closed;
    case "opening":
      return STATUS_COLORS.opening;
    default:
      return STATUS_COLORS.unknown;
  }
}

// SVG path definitions (Phosphor style)
const SVG_PATHS = {
  // Circle ring - thinner version (Regular weight, ~8px stroke instead of 12px)
  circleRing: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z",
  // CheckCircle inner checkmark (Bold)
  checkmark: "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51Z",
  // XCircle inner X (Bold)
  xMark: "M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17Z",
  // ArrowsClockwise (Bold)
  arrowsClockwise: "M228,48V96a12,12,0,0,1-12,12H168a12,12,0,0,1,0-24h19l-7.8-7.8a75.55,75.55,0,0,0-53.32-22.26h-.43A75.49,75.49,0,0,0,72.39,75.57,12,12,0,1,1,55.61,58.41a99.38,99.38,0,0,1,69.87-28.47H126A99.42,99.42,0,0,1,196.2,59.23L204,67V48a12,12,0,0,1,24,0ZM183.61,180.43a75.49,75.49,0,0,1-53.09,21.63h-.43A75.55,75.55,0,0,1,76.77,179.8L69,172H88a12,12,0,0,0,0-24H40a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V189l7.8,7.8A99.42,99.42,0,0,0,130,226.06h.56a99.38,99.38,0,0,0,69.87-28.47,12,12,0,0,0-16.78-17.16Z",
  // Wrench Fill (solid version - cleaner for construction status)
  constructionIcon: "M232,96a72,72,0,0,1-100.94,66L79,222.22c-.12.14-.26.29-.39.42a32,32,0,0,1-45.26-45.26c.14-.13.28-.27.43-.39L94,124.94a72.07,72.07,0,0,1,83.54-98.78,8,8,0,0,1,3.93,13.19L144,80l5.66,26.35L176,112l40.65-37.52a8,8,0,0,1,13.19,3.93A72.6,72.6,0,0,1,232,96Z",
  // Question mark inner content only (Bold) - no circle, will be scaled
  questionMark: "M144,180a16,16,0,1,1-16-16A16,16,0,0,1,144,180ZM128,64c-24.26,0-44,17.94-44,40v4a12,12,0,0,0,24,0v-4c0-8.82,9-16,20-16s20,7.18,20,16-9,16-20,16a12,12,0,0,0-12,12v8a12,12,0,0,0,23.73,2.56C158.31,137.88,172,122.37,172,104,172,81.94,152.26,64,128,64Z",
  // Triangle fill - solid triangle
  triangleFill: "M236.78,211.81A24.34,24.34,0,0,1,215.45,224H40.55a24.34,24.34,0,0,1-21.33-12.19,23.51,23.51,0,0,1,0-23.72L106.65,36.22a24.76,24.76,0,0,1,42.7,0L236.8,188.09A23.51,23.51,0,0,1,236.78,211.81Z",
  // Exclamation line (bold - 12px wide)
  exclamationLine: "M116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Z",
  // Exclamation dot (bold - 16px radius)
  exclamationDot: "M144,176a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z",
};

// Circle ring opacity (60% - inner icons at full opacity)
const RING_OPACITY = 0.6;

/**
 * Generate SVG string for a bridge status icon
 * Used for Mapbox markers which require raw HTML strings
 */
export function getStatusIconSvg(status: string, size: number = 24): string {
  const color = getStatusIconColor(status);

  switch (status) {
    case "open":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256">
        <path fill="${color}" opacity="${RING_OPACITY}" d="${SVG_PATHS.circleRing}"/>
        <g transform="translate(19.2, 19.2) scale(0.85)">
          <path fill="${color}" d="${SVG_PATHS.checkmark}"/>
        </g>
      </svg>`;

    case "closingSoon":
      // Returns just the checkmark circle, badge is added separately
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256">
        <path fill="${color}" opacity="${RING_OPACITY}" d="${SVG_PATHS.circleRing}"/>
        <g transform="translate(19.2, 19.2) scale(0.85)">
          <path fill="${color}" d="${SVG_PATHS.checkmark}"/>
        </g>
      </svg>`;

    case "closed":
    case "closing":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256">
        <path fill="${color}" opacity="${RING_OPACITY}" d="${SVG_PATHS.circleRing}"/>
        <g transform="translate(19.2, 19.2) scale(0.85)">
          <path fill="${color}" d="${SVG_PATHS.xMark}"/>
        </g>
      </svg>`;

    case "opening":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256">
        <path fill="${color}" opacity="${RING_OPACITY}" d="${SVG_PATHS.circleRing}"/>
        <g transform="translate(61.44, 61.44) scale(0.52)">
          <path fill="${color}" d="${SVG_PATHS.arrowsClockwise}"/>
        </g>
      </svg>`;

    case "construction":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256">
        <path fill="${color}" opacity="${RING_OPACITY}" d="${SVG_PATHS.circleRing}"/>
        <g transform="translate(70.4, 70.4) scale(0.45)">
          <path fill="${color}" d="${SVG_PATHS.constructionIcon}"/>
        </g>
      </svg>`;

    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256">
        <path fill="${STATUS_COLORS.unknown}" opacity="${RING_OPACITY}" d="${SVG_PATHS.circleRing}"/>
        <g transform="translate(38.4, 38.4) scale(0.7)">
          <path fill="${STATUS_COLORS.unknown}" d="${SVG_PATHS.questionMark}"/>
        </g>
      </svg>`;
  }
}

/**
 * Generate warning badge SVG string (for closingSoon status)
 * Yellow triangle with black ! on top
 */
export function getWarningBadgeSvg(size: number = 14): string {
  // Multiple drop-shadows to create border effect around the triangle shape
  const borderColor = "#1a1a1a";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256" style="filter: drop-shadow(1px 0 0 ${borderColor}) drop-shadow(-1px 0 0 ${borderColor}) drop-shadow(0 1px 0 ${borderColor}) drop-shadow(0 -1px 0 ${borderColor});">
    <path fill="${STATUS_COLORS.closingSoonBadge}" d="${SVG_PATHS.triangleFill}"/>
    <path fill="#000000" d="${SVG_PATHS.exclamationLine}"/>
    <path fill="#000000" d="${SVG_PATHS.exclamationDot}"/>
  </svg>`;
}

/**
 * Generate complete closingSoon icon HTML (icon + badge)
 */
export function getClosingSoonIconHtml(iconSize: number, badgeSize: number): string {
  const color = STATUS_COLORS.open; // closingSoon uses green like open
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 256 256">
    <path fill="${color}" opacity="${RING_OPACITY}" d="${SVG_PATHS.circleRing}"/>
    <g transform="translate(19.2, 19.2) scale(0.85)">
      <path fill="${color}" d="${SVG_PATHS.checkmark}"/>
    </g>
  </svg>`;
  const badgeSvg = getWarningBadgeSvg(badgeSize);

  return `<div style="position: relative; display: inline-flex; width: ${iconSize}px; height: ${iconSize}px;">
    ${iconSvg}
    <div style="position: absolute; bottom: 0; right: 0; width: ${badgeSize}px; height: ${badgeSize}px; display: flex; align-items: center; justify-content: center;">
      ${badgeSvg}
    </div>
  </div>`;
}

interface BridgeStatusIconProps {
  status: string;
  size?: number;
  className?: string;
}

/**
 * Bridge status icon React component
 * Uses the same SVG/HTML generation as map markers for consistency
 * Circle parts at 60% opacity, inner icons at full opacity
 */
export function BridgeStatusIcon({
  status,
  size = 24,
  className = "",
}: BridgeStatusIconProps): React.ReactElement {
  // For closingSoon, use the shared HTML generator (same as map pins)
  if (status === "closingSoon") {
    const badgeSize = Math.round(size * 0.43);
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: getClosingSoonIconHtml(size, badgeSize) }}
      />
    );
  }

  // For all other statuses, use shared SVG generator
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: getStatusIconSvg(status, size) }}
    />
  );
}
