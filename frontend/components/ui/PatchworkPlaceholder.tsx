// A deterministic, patchwork-inspired placeholder used wherever real
// photography isn't available yet. The patchwork motif nods to Kawandi
// quilting (one of AKSSADA's cultural-heritage areas) rather than a
// generic gradient block, and swaps out cleanly once real images exist.

const PALETTE = [
  "#c98a54",
  "#b85c32",
  "#8f7440",
  "#3f4f3c",
  "#e4d3ab",
  "#26362c",
];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function PatchworkPlaceholder({
  seed = 1,
  className = "",
  label,
  bare = false,
}: {
  seed?: number;
  className?: string;
  label?: string;
  /** Skip the default rounded corners/border — used for full-bleed backgrounds like the Hero. */
  bare?: boolean;
}) {
  const rand = seededRandom(seed * 97 + 13);
  const cols = 6;
  const rows = 4;
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = PALETTE[Math.floor(rand() * PALETTE.length)];
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * cellW}
          y={r * cellH}
          width={cellW}
          height={cellH}
          fill={color}
        />,
      );
    }
  }

  return (
    <div
      className={`overflow-hidden ${bare ? "" : "rounded-md border border-line"} ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        {cells}
      </svg>
      {!bare && (
        <div className="pointer-events-none absolute inset-0 border border-cream/20" />
      )}
    </div>
  );
}
