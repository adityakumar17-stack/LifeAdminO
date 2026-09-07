-- Run this in Supabase: SQL Editor → New query → Run
-- Then: Database → Replication → enable Realtime for these tables if not already added.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  daily_steps int not null default 10000,
  daily_calories int not null default 2000,
  weekly_workouts int not null default 4,
  water_intake int not null default 8,
  target_weight double precision,
  units text not null default 'metric',
  theme text not null default 'dark',
  notifications boolean not null default true
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  type text not null default 'other',
  duration int not null default 0,
  calories_burned int not null default 0,
  exercises_json text not null default '[]',
  notes text,
  date text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  type text not null default 'snack',
  calories int not null default 0,
  protein int not null default 0,
  carbs int not null default 0,
  fat int not null default 0,
  date text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date text not null,
  steps int not null default 0,
  calories_burned int not null default 0,
  active_minutes int not null default 0,
  water_intake int not null default 0,
  weight double precision,
  unique (user_id, date)
);

create index if not exists workouts_user_date_idx on public.workouts (user_id, date);
create index if not exists meals_user_date_idx on public.meals (user_id, date);
create index if not exists daily_activities_user_idx on public.daily_activities (user_id);

alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.meals enable row level security;
alter table public.daily_activities enable row level security;

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "workouts_own" on public.workouts;
create policy "workouts_own" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "meals_own" on public.meals;
create policy "meals_own" on public.meals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "activities_own" on public.daily_activities;
create policy "activities_own" on public.daily_activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.workouts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.meals;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_activities;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
