import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

// 未ログインユーザー向けのルート（ログイン・会員登録画面）
// ログイン済みの場合は物件一覧画面へ移動する
export default function PublicOnlyRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return <p className="loading">読み込み中...</p>
  }

  if (session) {
    return <Navigate to="/properties" replace />
  }

  return children
}
