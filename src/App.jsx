import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import PropertiesPage from './pages/PropertiesPage'

// ルーティング定義
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 未ログイン時のみ表示する画面 */}
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignUpPage /></PublicOnlyRoute>} />

          {/* ログイン必須の画面 */}
          <Route path="/properties" element={<ProtectedRoute><PropertiesPage /></ProtectedRoute>} />

          {/* それ以外のURLは物件一覧へ（未ログインならログイン画面へリダイレクトされる） */}
          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
