-- Plant Launch Readiness — initial schema
-- Tables: plants, plant_managers, owner_assignments
-- RLS: a plant manager can only read/write data for plants they are linked to
-- via plant_managers.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- plants
-- ---------------------------------------------------------------------------
create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz not null default now()
);

alter table public.plants enable row level security;

-- A manager can only see plants they are linked to via plant_managers.
create policy "plants: select own"
  on public.plants for select
  to authenticated
  using (
    exists (
      select 1 from public.plant_managers pm
      where pm.plant_id = plants.id
        and pm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- plant_managers — join table linking auth users to the plants they manage
-- ---------------------------------------------------------------------------
create table if not exists public.plant_managers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plant_id uuid not null references public.plants (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, plant_id)
);

alter table public.plant_managers enable row level security;

-- A user may only see their own plant links (not other managers').
create policy "plant_managers: select own"
  on public.plant_managers for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- owner_assignments
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'owner_role') then
    create type public.owner_role as enum ('program', 'operational', 'training_safety');
  end if;
end $$;

create table if not exists public.owner_assignments (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants (id) on delete cascade,
  role public.owner_role not null,
  person_name text not null check (char_length(trim(person_name)) between 2 and 80),
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users (id),
  -- one active assignment per role per plant; re-assigning replaces it.
  unique (plant_id, role)
);

alter table public.owner_assignments enable row level security;

create policy "owner_assignments: select own plants"
  on public.owner_assignments for select
  to authenticated
  using (
    exists (
      select 1 from public.plant_managers pm
      where pm.plant_id = owner_assignments.plant_id
        and pm.user_id = auth.uid()
    )
  );

create policy "owner_assignments: insert own plants"
  on public.owner_assignments for insert
  to authenticated
  with check (
    exists (
      select 1 from public.plant_managers pm
      where pm.plant_id = owner_assignments.plant_id
        and pm.user_id = auth.uid()
    )
  );

create policy "owner_assignments: update own plants"
  on public.owner_assignments for update
  to authenticated
  using (
    exists (
      select 1 from public.plant_managers pm
      where pm.plant_id = owner_assignments.plant_id
        and pm.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.plant_managers pm
      where pm.plant_id = owner_assignments.plant_id
        and pm.user_id = auth.uid()
    )
  );

create policy "owner_assignments: delete own plants"
  on public.owner_assignments for delete
  to authenticated
  using (
    exists (
      select 1 from public.plant_managers pm
      where pm.plant_id = owner_assignments.plant_id
        and pm.user_id = auth.uid()
    )
  );

-- Enable realtime so the launch panel updates without a page reload.
alter publication supabase_realtime add table public.owner_assignments;
