create extension if not exists "pgcrypto";

create type public.job_status as enum ('queued', 'storyboarding', 'rendering', 'ready', 'failed');
create type public.subscription_plan as enum ('starter', 'pro', 'agency');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  plan public.subscription_plan not null default 'starter',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text not null,
  rights_confirmed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.property_assets (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.video_jobs (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.job_status not null default 'queued',
  provider text not null default 'mock-local',
  storyboard jsonb,
  preview_path text,
  output_path text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_assets enable row level security;
alter table public.video_jobs enable row level security;

create policy "profiles are self readable" on public.profiles for select using (auth.uid() = id);
create policy "profiles are self editable" on public.profiles for update using (auth.uid() = id);
create policy "properties owned by user" on public.properties for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "assets owned by user" on public.property_assets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "jobs owned by user" on public.video_jobs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('property-assets', 'property-assets', false) on conflict (id) do nothing;
create policy "users manage their property assets" on storage.objects for all using (bucket_id = 'property-assets' and auth.uid()::text = (storage.foldername(name))[1]) with check (bucket_id = 'property-assets' and auth.uid()::text = (storage.foldername(name))[1]);
