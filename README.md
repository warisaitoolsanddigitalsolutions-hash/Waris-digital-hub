# Waris Ali Digital Hub

Production architecture: GitHub Pages frontend + Supabase Auth/Postgres/Storage. Firebase is not used.

Supabase Auth provides real Google OAuth sessions. Postgres Row Level Security enforces user/admin authorization. Supabase Storage holds uploaded product images, logos and screenshots. GitHub Actions injects only the public Supabase URL and publishable key at deploy time; no secret/service key is shipped to the browser.

Setup:
1. Create a Supabase project.
2. Run supabase/schema.sql in Supabase SQL Editor.
3. Run supabase/seed.sql for the initial 47 directory resources.
4. Enable Google in Supabase Auth and configure the Google OAuth client.
5. Add the GitHub Pages login callback to Supabase Auth Redirect URLs.
6. Add GitHub Actions secrets named SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.
7. Set GitHub Pages source to GitHub Actions.

The configured admin email is warisalidigitalsolutions@gmail.com. The signup trigger assigns that account the admin role. Admin authorization is enforced by Postgres RLS, not by frontend visibility alone.
