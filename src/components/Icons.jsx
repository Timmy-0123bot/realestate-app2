// アプリ内で使うアイコン（色は CSS の fill / color で指定する）

// 星アイコン
export function StarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6l-6.4 3.5L7 14l-5.3-5 7.2-.9z" />
    </svg>
  )
}

// 飛行機の形（機首が上向き、24×24 の座標系）。他のSVG内に直接描く場合に使う
export function PlanePath() {
  return (
    <path
      className="plane"
      d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"
    />
  )
}

// 飛行機アイコン
export function PlaneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <PlanePath />
    </svg>
  )
}
