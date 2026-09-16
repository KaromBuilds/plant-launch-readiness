# Plant Launch Readiness

Week 6 project. A Plant Manager cannot launch a plant's VR emergency-response
rehearsal program until the three required owners (program, operational,
training/safety) are assigned with no conflicts. See `docs/PACKET.md` for the
full problem statement, flow diagram, and test plan, and `DECISIONS.md` for a
running log of build decisions.

## Stack

- Next.js (App Router) + Tailwind CSS, deployed on Vercel
- Supabase: Postgres + Auth (Google Sign-In) + Row Level Security
- Three.js for the locked/unlocked VR preview
- A fixed-coordinate SVG map for the plant status overview

## Local setup

1. `npm install`
2. Create a Supabase project (https://supabase.com/dashboard).
3. In **Authentication > Providers**, enable **Google** and fill in your
   Google OAuth client ID/secret (Google Cloud Console > APIs & Services >
   Credentials > OAuth client ID, type "Web application", with
   `https://<your-project-ref>.supabase.co/auth/v1/callback` as an
   authorized redirect URI).
4. In **Authentication > URL Configuration**, add your local
   (`http://localhost:3000/auth/callback`) and production callback URLs to
   the allow list.
5. Run the SQL in `supabase/migrations/0001_init.sql` in the Supabase SQL
   editor (creates the schema and RLS policies), then run
   `supabase/seed.sql` (seeds demo plants).
6. Sign in once locally with Google so your `auth.users` row exists, copy
   your user id from **Authentication > Users**, and run the commented
   `plant_managers` insert at the bottom of `supabase/seed.sql` (with your
   id pasted in) so you're linked to a demo plant.
7. Copy `.env.local.example` to `.env.local` and fill in your Supabase
   project URL and anon key (**Project Settings > API**). Never commit
   `.env.local`.
8. `npm run dev` and open http://localhost:3000.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as
   Vercel environment variables (never commit secrets to the repo).
3. Add the deployed origin's callback URL
   (`https://<your-app>.vercel.app/auth/callback`) to Supabase's
   Auth URL Configuration allow list.

## Security floor

- No API keys or secrets are committed; all live in `.env.local` (gitignored)
  and Vercel environment variables.
- Every app route other than `/login` and `/auth/callback` requires a
  Supabase-authenticated session (enforced in `src/middleware.ts`).
- Row Level Security is enabled on every table holding assignment data.
- Forms validate `person_name` (length 2–80, non-empty after trim) both
  client-side and via a database `check` constraint.
- All seed plant and person names are invented for this course project.
