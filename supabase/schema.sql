-- ============================================================
-- 不動産管理アプリ用テーブル定義
-- Supabaseダッシュボードの「SQL Editor」に貼り付けて実行してください
-- ============================================================

-- 物件テーブル
create table if not exists public.properties (
  id         bigint generated always as identity primary key,
  -- 登録したユーザー（未指定時はログイン中のユーザーIDを自動設定）
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- 物件名
  name       text not null check (char_length(name) between 1 and 100),
  -- 家賃（円）
  rent       integer not null check (rent >= 0),
  -- エリア名
  area       text not null check (char_length(area) between 1 and 100),
  -- 間取り（例：1LDK）
  layout     text not null check (char_length(layout) between 1 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ユーザーごとの絞り込みを高速化するインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- 更新時に updated_at を自動で現在時刻にするトリガー
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 行レベルセキュリティ（RLS）
-- ------------------------------------------------------------
alter table public.properties enable row level security;

-- ログインユーザーにテーブル操作を許可する（実際に操作できる行はRLSポリシーで制限）
grant select, insert, update, delete on public.properties to authenticated;

-- 自分が登録した物件のみ表示できる
drop policy if exists "自分の物件のみ表示" on public.properties;
create policy "自分の物件のみ表示"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 自分のユーザーIDでのみ登録できる（他人になりすました登録を防ぐ）
drop policy if exists "自分の物件として登録" on public.properties;
create policy "自分の物件として登録"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 自分が登録した物件のみ編集できる（所有者の付け替えも禁止）
drop policy if exists "自分の物件のみ編集" on public.properties;
create policy "自分の物件のみ編集"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 自分が登録した物件のみ削除できる
drop policy if exists "自分の物件のみ削除" on public.properties;
create policy "自分の物件のみ削除"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
