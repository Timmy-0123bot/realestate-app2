import Brand from './Brand'
import { PlanePath, StarIcon } from './Icons'

// 背景に散りばめる星の位置と大きさ（装飾）
const STARS = [
  { top: '14%', left: '62%', size: 14 },
  { top: '26%', left: '84%', size: 22 },
  { top: '38%', left: '18%', size: 10 },
  { top: '52%', left: '74%', size: 12 },
  { top: '8%', left: '40%', size: 8 },
  { top: '46%', left: '46%', size: 16 },
]

// ログイン・会員登録画面で共通のレイアウト
// PCでは左にブランド表示、右にフォームの2カラム、スマホでは1カラムになる
export default function AuthLayout({ eyebrow, title, children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-visual">
        <Brand />

        {/* 夜空の星と、点線の飛行ルートを進む飛行機（装飾） */}
        <div className="sky" aria-hidden="true">
          {STARS.map((star, i) => (
            <span
              key={i}
              className="sky-star"
              style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
            >
              <StarIcon />
            </span>
          ))}
          <svg className="flight-path" viewBox="0 0 400 200">
            <path className="route" d="M0 190 Q 180 170 330 40" />
            <g transform="translate(308 18) scale(1.8) rotate(49 12 12)">
              <PlanePath />
            </g>
          </svg>
        </div>

        <p className="auth-tagline">
          いい物件へ、
          <br />
          ひとっ飛び。
        </p>
      </aside>

      <main className="auth-main">
        <div className="auth-container">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
