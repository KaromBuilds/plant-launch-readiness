# Decisions log

## 2026-09-16 — Initial build (commits 1–9)

Built the full app end-to-end in the order given in the implementation
prompt, as small commits (scaffold → auth → plant list/RLS → owner
checklist → lock logic → conflict detector → VR unlock → status map →
polish). All nine are on `main`.

**Real Google Sign-In instead of a role selector.** `docs/PACKET.md`'s scope
cut says "Real authentication (Google Auth/SSO) — role is simulated via a
simple selector," but the implementation prompt for this build explicitly
required Supabase Auth with Google Sign-In and RLS as part of the Security
Floor. I went with the implementation prompt (it's the newer, more specific
instruction) and built real Google OAuth via Supabase Auth. Worth
double-checking with the grading rubric which one is actually expected —
if a simulated role selector was intended, that's a simplification, not an
addition, so it'd be easy to swap.

**Fixed-coordinate SVG map instead of Mapbox GL JS.** The packet offers
either option. Mapbox needs its own API token (another secret to provision
and another signup step), and the whole point of "fixed coordinates for 2-3
plants" is that we don't need real map tiles. The status map
(`src/components/plant-map/plant-status-map.tsx`) projects each plant's
lat/lng onto a plain SVG viewbox and colors markers green/amber/red by
readiness. If a real basemap is wanted later, this component is the only
thing that would need replacing.

**One active assignment per (plant, role), not a history log.** `owner_
assignments` has a `unique(plant_id, role)` constraint; assigning a name
upserts and replaces whoever was there before. The packet's data model
doesn't ask for reassignment history, so this stays simple. If audit history
becomes a requirement, that's a schema change (drop the unique constraint,
add a `superseded_at` column or a separate history table).

**Conflict detection is scoped to the plants a manager can see.** Test plan
item 3 wants a warning when the same person is assigned to two roles or two
plants. RLS means a manager can only ever query owner_assignments for their
own linked plants anyway, so "check across all plants" naturally becomes
"check across all plants this manager manages" — there's no way (or need)
to compare against another manager's plants client-side.

**No `launched` state in the database.** The packet's data model doesn't
include a launch/launched column, and the scope cut excludes the actual VR
content. Clicking "Lanzar programa de rehearsal" just flips a local React
state to show a confirmation line — it doesn't persist anything. If a real
launch needs to be recorded (e.g. for the map or for history), that's a new
column and a straightforward write.

**Local tooling note:** `~/.npm`'s cache had root-owned files from a past
`sudo npm` run, which broke `npm install` in this project until installs
were pointed at a scratch cache dir. Running
`sudo chown -R 501:20 "/Users/karom/.npm"` once (outside this session, since
it needs sudo) will fix it for good.

## 2026-09-16 — Supabase project setup and first live sign-in

Created the real Supabase project (`axqirqfeqrhuvetidoed`), wired up Google
Sign-In, and confirmed the app works end to end against live infra —
karom.builds@gmail.com signed in via Google, is linked to all 3 seeded
plants as a manager, and the plant list + status map render real data.

**Found and fixed a migration ordering bug.** The first two attempts to run
`supabase/migrations/0001_init.sql` failed: `CREATE POLICY` resolves every
relation named in its `USING`/`WITH CHECK` expression at creation time (not
lazily), and the original script created the `plants` table's RLS policy —
which reads `plant_managers` — before the `plant_managers` table existed
later in the same file. Because the SQL editor runs a pasted script as one
transaction, the whole thing rolled back both times, which looked like "the
migration silently did nothing" rather than "the migration has an ordering
bug." Fixed by reordering: both tables now get created first, then
`plant_managers`' own policy, then the `plants` policy that depends on it,
then `owner_assignments` and its policies. Saved as a general lesson (not
project-specific) for future RLS migrations.

**`supabase_migration.sql`** (repo root, untracked) is a scratch copy-paste
convenience file combining the migration + seed SQL into one block, created
so it could be pasted into the Supabase SQL editor without hunting through
two files. It's intentionally not committed — `supabase/migrations/
0001_init.sql` and `supabase/seed.sql` stay the source of truth; delete the
scratch file whenever it's no longer useful.

**Linking a manager to plants turned out easier by email than by UUID.**
Instead of asking the user to copy their `auth.users` id from the dashboard
(the original plan baked into `supabase/seed.sql`'s commented block), the
SQL editor can look the id up directly:
```sql
insert into public.plant_managers (user_id, plant_id)
select u.id, p.id
from auth.users u
cross join public.plants p
where u.email = 'the-managers-email@example.com'
on conflict do nothing;
```
Worth updating `supabase/seed.sql`'s instructions to lead with this instead
of the copy-the-UUID approach.

## Outstanding manual setup

1. ~~Create a Supabase project, run the migration + seed SQL.~~ Done.
2. ~~Enable Google Sign-In in Supabase Auth.~~ Done (local redirect URL
   only — `http://localhost:3000/auth/callback`).
3. ~~Link a manager account to demo plants.~~ Done for
   karom.builds@gmail.com (all 3 plants).
4. Connect the GitHub repo to a Vercel project, set
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` there, and
   add the deployed callback URL
   (`https://<app>.vercel.app/auth/callback`) to Supabase's Auth
   URL Configuration redirect list alongside the localhost one.

## Tomorrow's first move

Deploy to Vercel (step 4 above), then walk through all 7 items in
`docs/PACKET.md`'s Test Plan against the deployed app — not just localhost
— since that's the actual acceptance test for calling this shipped.
