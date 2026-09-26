# Client Dashboard

Production-style demo built with Next.js 16, React 19, TypeScript, Tailwind CSS and Supabase/PostgreSQL.

## Features
- Email/password sign up, sign in, sign out and password reset
- Strong-password validation
- Protected client dashboard
- Editable user profile
- Activity log
- `client` / `admin` role model
- Admin user list with search and role filter
- Admin user detail page and role management
- Row Level Security (RLS)
- Server-side authentication with Supabase SSR
- API routes with server-side validation
- Loading and error states

## Local setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and add your Supabase URL and publishable key.
3. In Supabase SQL Editor, run `supabase/schema.sql`.
4. At the bottom of that SQL file, run the provided UPDATE statement with the email of the account that should be admin.
5. In Supabase Authentication URL Configuration, set Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` as a redirect URL.
6. Start: `npm run dev`

## Production deployment
Deploy to Vercel and add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as environment variables. Add the production `/auth/callback` URL to Supabase Redirect URLs.

## Database
`supabase/schema.sql` contains the schema upgrade, trigger, RLS policies, admin helper and activity table needed by the application.
