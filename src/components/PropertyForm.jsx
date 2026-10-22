import { useState } from 'react'

// 物件の新規登録・編集で共通して使うフォーム
// initialValues を渡すと編集モード、渡さないと新規登録モードになる
export default function PropertyForm({ initialValues, onSubmit, onCancel }) {
  const isEdit = Boolean(initialValues)
  const [name, setName] = useState(initialValues?.name ?? '')
  const [rent, setRent] = useState(initialValues?.rent?.toString() ?? '')
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [layout, setLayout] = useState(initialValues?.layout ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // 前後の空白を除き、家賃は数値に変換して親コンポーネントへ渡す
      await onSubmit({
        name: name.trim(),
        rent: Number(rent),
        area: area.trim(),
        layout: layout.trim(),
      })
    } catch (err) {
      setError(`保存に失敗しました：${err.message}`)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <h2>{isEdit ? '物件を編集' : '物件を新規登録'}</h2>
      <div className="form-grid">
        <label>
          物件名
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
        </label>
        <label>
          家賃（円）
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            required
            min={0}
            step={1}
          />
        </label>
        <label>
          エリア名
          <input value={area} onChange={(e) => setArea(e.target.value)} required maxLength={100} />
        </label>
        <label>
          間取り
          <input
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            required
            maxLength={20}
            placeholder="例：1LDK"
          />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : isEdit ? '更新する' : '登録する'}
        </button>
      </div>
    </form>
  )
}
