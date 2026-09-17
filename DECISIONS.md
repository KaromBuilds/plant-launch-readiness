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

## Outstanding manual setup (only the user can do this — needs real accounts)

1. Create a Supabase project, run `supabase/migrations/0001_init.sql` then
   `supabase/seed.sql` in the SQL editor.
2. Enable the Google provider in Supabase Auth with a real Google OAuth
   client, and add the local + prod callback URLs to the Auth URL allow
   list.
3. Sign in once locally, copy your `auth.users` id, and link yourself to a
   demo plant via the commented block at the bottom of `supabase/seed.sql`.
4. Copy `.env.local.example` to `.env.local` and fill in the real Supabase
   URL/anon key.
5. Connect the GitHub repo to a Vercel project and set the same two env
   vars there.

Full steps are in `README.md`.

## Tomorrow's first move

Once the Supabase project and Vercel deploy exist: walk through all 7 items
in `docs/PACKET.md`'s Test Plan against the live app (not just the local
build) and fix anything that doesn't hold up under a real Google session
and real RLS — that's the actual acceptance test for calling this shipped.
