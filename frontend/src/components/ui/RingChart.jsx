/**
 * RingChart — SVG donut ring chart showing percentage completion.
 * Shared between woredadashboard.jsx and subcitydashboard.jsx.
 *
 * Props:
 *   actual      {number} – actual reported value
 *   target      {number} – target value (period-adjusted)
 *   color       {string} – hex color for the filled arc
 *   label       {string} – field label shown above the ring
 *   description {string} – subtitle shown below the label
 */
export default function RingChart({ actual, target, color, label, description }) {
  // Raw percentage — can exceed 100% when actual surpasses the target
  const pct = target > 0 ? Math.round((actual / target) * 100) : 0;
  // Arc is visually capped at 100% so it doesn't wrap; the number still shows the real %
  const arcPct = Math.min(pct, 100);
  const size = 140,
    sw = 14,
    r = (size - sw) / 2,
    circ = 2 * Math.PI * r;
  const offset = circ - (arcPct / 100) * circ;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col items-center shadow-sm">
      <p className="text-sm font-bold text-[#334155] mb-0.5 text-center">
        {label}
      </p>
      <p className="text-xs text-[#94a3b8] mb-3 text-center">{description}</p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={sw}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.7s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-2xl font-extrabold leading-none"
            style={{ color }}
          >
            {pct}%
          </span>
          <span className="text-xs text-[#94a3b8] mt-1">done</span>
        </div>
      </div>
      <div className="mt-4 w-full space-y-1">
        <div className="flex justify-between text-xs text-[#64748b]">
          <span>Actual</span>
          <span className="font-semibold text-[#1e293b]">
            {Number(actual).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-[#64748b]">
          <span>Target (period)</span>
          <span className="font-semibold text-[#1e293b]">
            {Number(target).toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mt-2">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${arcPct}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}
