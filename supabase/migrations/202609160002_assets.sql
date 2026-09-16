-- Canonical forward migration: the product domain is Asset, not Property.
-- Existing properties remain readable for backwards compatibility.
create type public.asset_type as enum ('villa', 'rental', 'yacht', 'private_jet', 'supercar');

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type public.asset_type not null,
  location text not null,
  metadata jsonb not null default '{}'::jsonb,
  rights_confirmed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.asset_media (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Preserve existing work while making the new model canonical for new jobs.
insert into public.assets (id, user_id, name, type, location, metadata, rights_confirmed_at, created_at)
select id, user_id, name, 'villa', address, jsonb_build_object('legacyPropertyId', id), rights_confirmed_at, created_at
from public.properties
on conflict (id) do nothing;

alter table public.video_jobs add column if not exists asset_id uuid references public.assets(id) on delete cascade;
update public.video_jobs set asset_id = property_id where asset_id is null;

insert into public.asset_media (id, asset_id, user_id, storage_path, sort_order, created_at)
select id, property_id, user_id, storage_path, sort_order, created_at
from public.property_assets
on conflict (id) do nothing;

alter table public.assets enable row level security;
alter table public.asset_media enable row level security;
create policy "assets owned by user" on public.assets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "jobs can read owned assets" on public.assets for select using (auth.uid() = user_id);
create policy "asset media owned by user" on public.asset_media for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('asset-media', 'asset-media', false) on conflict (id) do nothing;
create policy "users manage generic asset media" on storage.objects for all using (bucket_id = 'asset-media' and auth.uid()::text = (storage.foldername(name))[1]) with check (bucket_id = 'asset-media' and auth.uid()::text = (storage.foldername(name))[1]);

-- Keep the private, user-scoped storage convention from the initial migration.
comment on table public.assets is 'Canonical premium asset model. type-specific fields live in metadata.';
comment on column public.video_jobs.asset_id is 'Canonical job relation; property_id remains for backwards compatibility.';
