import { supabase } from './supabase'

// 物件テーブルのCRUD操作をまとめたモジュール
// 表示・編集・削除できる行はRLSポリシーで「自分が登録した物件」に制限されている

const COLUMNS = 'id, name, rent, area, layout, created_at'

// 物件一覧を新しい順に取得する（SELECT）
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select(COLUMNS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// 物件を新規登録する（INSERT）
// user_id はテーブルのデフォルト値（auth.uid()）で自動設定される
export async function createProperty(property) {
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

// 物件を更新する（UPDATE）
export async function updateProperty(id, property) {
  const { data, error } = await supabase
    .from('properties')
    .update(property)
    .eq('id', id)
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

// 物件を削除する（DELETE）
export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) throw error
}
