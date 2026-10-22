// ログイン・会員登録画面で共通のレイアウト
// PCでは左にブランド表示、右にフォームの2カラム、スマホでは1カラムになる
export default function AuthLayout({ eyebrow, title, children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-visual">
        <p className="brand">
          不動産管理
          <small>PROPERTY MANAGER</small>
        </p>
        <p className="auth-tagline">
          物件の情報を、
          <br />
          ひとつの場所で美しく。
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
