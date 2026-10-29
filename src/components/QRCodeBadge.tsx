import React from 'react';

interface QRCodeBadgeProps {
  value?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
  showClickHint?: boolean;
}

export const QRCodeBadge: React.FC<QRCodeBadgeProps> = ({
  value = 'MEMBERSHIP-231045-SOOUKAHRAS',
  size = 110,
  className = '',
  onClick,
  showClickHint = false,
}) => {
  // Deterministic module pattern representing high-density realistic QR code matrix
  const matrix = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,0],
    [0,1,0,0,1,0,1,0,1,0,0,1,0,1,1,0,1],
    [1,1,0,1,0,1,0,1,0,1,1,0,1,0,1,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,1,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,1,1,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,0,1,0,1,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,0,1],
  ];

  const gridSize = matrix.length;
  const cellSize = 100 / gridSize;

  return (
    <div
      onClick={onClick}
      title={onClick ? 'اضغط للتحقق من صحة العضوية' : value}
      className={`relative inline-flex flex-col items-center bg-white p-2 rounded-xl shadow-md border border-cyan-400/40 select-none ${
        onClick ? 'cursor-pointer hover:ring-2 hover:ring-amber-400 hover:scale-[1.03] transition-all' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        {/* White background */}
        <rect width="100" height="100" fill="#FFFFFF" />

        {/* Matrix Modules */}
        {matrix.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            if (cell === 1) {
              return (
                <rect
                  key={`${rIdx}-${cIdx}`}
                  x={cIdx * cellSize}
                  y={rIdx * cellSize}
                  width={cellSize * 0.94}
                  height={cellSize * 0.94}
                  fill="#06182c"
                  rx={0.3}
                />
              );
            }
            return null;
          })
        )}

        {/* Center Club Emblem Badge */}
        <circle cx="50" cy="50" r="11" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="10" fill="#041427" />
        <circle cx="50" cy="50" r="8.5" fill="#f59e0b" />
      </svg>

      {/* Embedded emblem image inside the center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/assets/aistudio/Youth_Creativity_Club_Emblem_41b52108.png"
          alt="Emblem"
          className="w-5 h-5 object-cover rounded-full filter drop-shadow border border-amber-400/60"
        />
      </div>

      {showClickHint && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-amber-300 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded-full border border-amber-500/30">
          مسح رمز QR للتحقق
        </span>
      )}
    </div>
  );
};
