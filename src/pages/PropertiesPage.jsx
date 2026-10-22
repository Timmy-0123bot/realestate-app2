import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import PropertyForm from '../components/PropertyForm'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'

// 物件一覧画面（ログイン必須）
export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // フォームの表示状態：null＝非表示、'new'＝新規登録、物件オブジェクト＝その物件を編集
  const [formTarget, setFormTarget] = useState(null)

  // 画面表示時にSupabaseから物件一覧を取得する
  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) => setError(`物件の取得に失敗しました：${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  // ログアウトしてログイン画面へ戻る
  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  // フォーム送信時に新規登録または更新を行い、一覧に反映する
  const handleSubmit = async (values) => {
    if (formTarget === 'new') {
      const created = await createProperty(values)
      setProperties((prev) => [created, ...prev])
    } else {
      const updated = await updateProperty(formTarget.id, values)
      setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    }
    setFormTarget(null)
  }

  // 確認ダイアログを出してから物件を削除する
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return
    setError('')
    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
      // 編集中の物件を削除した場合はフォームを閉じる
      if (formTarget?.id === property.id) setFormTarget(null)
    } catch (err) {
      setError(`削除に失敗しました：${err.message}`)
    }
  }

  return (
    <div className="properties-page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            ログアウト
          </button>
        </div>
      </header>

      {formTarget ? (
        <PropertyForm
          // key を変えることで、編集対象が切り替わった際にフォームの入力値を初期化する
          key={formTarget === 'new' ? 'new' : formTarget.id}
          initialValues={formTarget === 'new' ? undefined : formTarget}
          onSubmit={handleSubmit}
          onCancel={() => setFormTarget(null)}
        />
      ) : (
        <div className="toolbar">
          <button onClick={() => setFormTarget('new')}>＋ 物件を新規登録</button>
        </div>
      )}

      {error && <p className="error page-error">{error}</p>}

      {loading ? (
        <p className="loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="empty">登録された物件はまだありません。</p>
      ) : (
        <ul className="property-grid">
          {properties.map((property) => (
            <li key={property.id} className="property-card">
              <div className="card-title">
                <h2>{property.name}</h2>
                <span className="layout-badge">{property.layout}</span>
              </div>
              <p className="rent">
                {/* 家賃を3桁区切りで表示する */}
                {property.rent.toLocaleString('ja-JP')}
                <span>円/月</span>
              </p>
              <p className="area">{property.area}</p>
              <div className="card-actions">
                <button className="secondary-button" onClick={() => setFormTarget(property)}>
                  編集
                </button>
                <button className="danger-button" onClick={() => handleDelete(property)}>
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
