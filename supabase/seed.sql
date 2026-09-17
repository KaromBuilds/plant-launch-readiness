-- Demo data for Plant Launch Readiness.
-- All plant and person names are invented for this course project and do
-- not refer to real facilities or real people.

insert into public.plants (name, lat, lng) values
  ('North Plant — Apodaca', 25.7785, -100.1817),
  ('Bajío Plant — Silao', 20.9433, -101.4267),
  ('Gulf Plant — Altamira', 22.3970, -97.9297)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Link yourself (the signed-in demo Plant Manager) to the seeded plants.
--
-- 1. Sign in once with Google in the running app so Supabase creates your
--    auth.users row.
-- 2. Run this block in the Supabase SQL editor, with your email in place of
--    'your-email@example.com' — it looks up your auth.users id directly, so
--    there's no need to copy a UUID from the dashboard by hand.
-- ---------------------------------------------------------------------------
-- insert into public.plant_managers (user_id, plant_id)
-- select u.id, p.id
-- from auth.users u
-- cross join public.plants p
-- where u.email = 'your-email@example.com'
-- on conflict do nothing;
