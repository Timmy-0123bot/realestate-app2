import { StarIcon } from './Icons'

// アプリのブランド表示（星マーク＋アプリ名）
export default function Brand() {
  return (
    <p className="brand">
      <StarIcon className="brand-star" />
      <span className="brand-text">
        不動産管理
        <small>PROPERTY MANAGER</small>
      </span>
    </p>
  )
}
