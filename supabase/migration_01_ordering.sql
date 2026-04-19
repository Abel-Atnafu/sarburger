-- ============================================================
-- SARBURGER — Migration: Online ordering + payment screenshots
-- Run this in Supabase > SQL Editor AFTER the initial schema.sql
-- ============================================================

-- Add payment columns to orders
alter table orders add column if not exists screenshot_url   text;
alter table orders add column if not exists payment_status   text not null default 'pending'
  check (payment_status in ('pending','uploaded','verified','rejected'));

-- Storage bucket for payment screenshots (public so admin can view by URL)
insert into storage.buckets (id, name, public)
  values ('screenshots', 'screenshots', true)
  on conflict (id) do nothing;

-- Anyone can upload a screenshot
create policy "public_upload_screenshots"
  on storage.objects for insert to anon
  with check (bucket_id = 'screenshots');

-- Anyone can read screenshots (filenames are unguessable UUIDs)
create policy "public_read_screenshots"
  on storage.objects for select to anon
  using (bucket_id = 'screenshots');
