import { useContext } from 'react'
import { AuthContext } from './authContext'

// 認証情報を取得するためのカスタムフック
export function useAuth() {
  return useContext(AuthContext)
}
