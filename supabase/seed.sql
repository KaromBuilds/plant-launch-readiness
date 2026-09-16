-- Demo data for Plant Launch Readiness.
-- All plant and person names are invented for this course project and do
-- not refer to real facilities or real people.

insert into public.plants (name, lat, lng) values
  ('Planta Norte — Apodaca', 25.7785, -100.1817),
  ('Planta Bajío — Silao', 20.9433, -101.4267),
  ('Planta Golfo — Altamira', 22.3970, -97.9297)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Link yourself (the signed-in demo Plant Manager) to the seeded plants.
--
-- 1. Sign in once with Google in the running app so Supabase creates your
--    auth.users row.
-- 2. Find your user id in the Supabase dashboard under
--    Authentication > Users, and paste it below in place of
--    'PASTE-YOUR-AUTH-USER-UUID-HERE'.
-- 3. Run this block in the Supabase SQL editor.
-- ---------------------------------------------------------------------------
-- insert into public.plant_managers (user_id, plant_id)
-- select 'PASTE-YOUR-AUTH-USER-UUID-HERE'::uuid, id
-- from public.plants
-- where name in ('Planta Norte — Apodaca', 'Planta Bajío — Silao')
-- on conflict do nothing;
