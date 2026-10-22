import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import AuthLayout from '../components/AuthLayout'

// 会員登録画面
export default function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // フォーム送信時にSupabaseで会員登録する
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // 入力内容のチェック
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください。')
      return
    }
    if (password !== passwordConfirm) {
      setError('パスワードが一致しません。')
      return
    }

    setSubmitting(true)
    const { data, error } = await signUp(email, password)
    setSubmitting(false)

    if (error) {
      setError(`会員登録に失敗しました：${error.message}`)
      return
    }

    // メール確認が無効な設定ならセッションが返るので、そのまま物件一覧へ遷移する
    if (data.session) {
      navigate('/properties', { replace: true })
      return
    }

    // メール確認が有効な設定の場合は確認メールの案内を表示する
    setMessage('確認メールを送信しました。メール内のリンクをクリックしてからログインしてください。')
  }

  return (
    <AuthLayout eyebrow="SIGN UP" title="会員登録">
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          パスワード（6文字以上）
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>
        <label>
          パスワード（確認）
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '登録する'}
        </button>
      </form>
      <p className="auth-link">
        すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
      </p>
    </AuthLayout>
  )
}
