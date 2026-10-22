-- ============================================================
-- 動作確認用のサンプルデータ（任意）
-- schema.sql の実行後に SQL Editor で実行すると、
-- ダミーアカウント demo@example.com の物件として登録されます
-- ============================================================
insert into public.properties (user_id, name, rent, area, layout)
select u.id, v.name, v.rent, v.area, v.layout
from auth.users u
cross join (values
  ('グランメゾン渋谷', 185000, '東京都渋谷区', '2LDK'),
  ('パークハイツ新宿', 142000, '東京都新宿区', '1LDK'),
  ('リバーサイド目黒', 128000, '東京都目黒区', '1DK'),
  ('サンライズ横浜', 98000, '神奈川県横浜市', '1K')
) as v (name, rent, area, layout)
where u.email = 'demo@example.com';
