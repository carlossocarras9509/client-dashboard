# Client Dashboard

A production-style client management dashboard built with **Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase, and PostgreSQL**.

The project demonstrates a complete authentication and role-based management workflow for a modern SaaS-style application, including protected client areas, administrative tools, profile management, activity tracking, database security, and production deployment.

## Live Demo

Production application:

https://client-dashboard-seven-bay.vercel.app

## Overview

Client Dashboard provides two application roles:

- **Client** — manages personal account information and views recent account activity.
- **Admin** — manages users, searches and filters accounts, reviews user details, and updates user roles.

Authentication and database services are provided by Supabase, while the frontend and server-side application logic are implemented with Next.js.

## Features

### Authentication

- Email and password registration
- Unique username assigned at registration (email prefix suggested, editable before signup)
- Secure sign in and sign out
- Password reset workflow
- In-account password change
- Authentication and security activity auditing
- Strong-password validation
- Protected application routes
- Supabase SSR authentication
- Authentication callback handling

### Client Dashboard

- Account overview
- Editable user profile
- Unique editable username
- Company and phone information
- Account status
- Role information
- Recent activity history
- Sign-in, sign-out, profile, password, registration and email-confirmation events
- Responsive dashboard interface
- Loading, empty, success, and error states

### Admin Dashboard

- Administrative dashboard
- User listing with names, usernames and email identities
- Search users
- Filter users by role
- User detail pages
- Update user roles with actor-aware audit history
- Client/Admin role model
- Protected administrative functionality

### Backend & API

- Next.js API routes
- Server-side authentication checks
- Request validation
- Structured API error handling
- Profile update API
- Administrative user APIs
- Activity logging

### Database & Security

- PostgreSQL database through Supabase
- `profiles` table with unique usernames
- `activity_logs` table
- Authentication/profile relationship
- Automatic profile creation for new users
- Database triggers
- Row Level Security (RLS)
- Client-specific access policies
- Administrator access policies

## Demo Accounts

For the final evaluation, two preconfigured demonstration accounts can be provided: one **Administrator** and one **Client**. These accounts are intended for immediate role-based testing and should contain demonstration data only.

The demo credentials can be shared with the evaluator separately or added here immediately before delivery. Avoid reusing any personal password.

### Testing the Complete Email Authentication Flow

The preconfigured demo accounts are best for quickly reviewing the Admin and Client experiences. To test email-dependent authentication features, the evaluator should register a new account using an email address they can access.

New registrations are automatically assigned the `client` role. The registration form suggests a username from the part of the email before `@`, but the evaluator can replace it with any available valid username. Usernames are unique even when two users have the same full name. Using a real accessible email allows the evaluator to test the complete lifecycle:

- Account registration
- Email confirmation
- Sign in and sign out
- Forgot-password email delivery
- Password recovery
- In-account password change
- Protected routes
- Activity history

An administrator can later promote that newly registered account to `admin` from User Management, allowing the role-management workflow to be evaluated as well.

## Activity Audit Trail

The application records meaningful authenticated account events in `activity_logs`, including:

- Account creation
- Email confirmation
- Successful sign in
- Sign out
- Profile updates
- Password changes from Security settings
- Completed password recovery
- Administrator role changes, including the previous role, new role and administrator identity

Password values, recovery tokens, session tokens and other secrets are never written to the activity log. A forgot-password **request** is intentionally not attached to a user audit record because the request is unauthenticated; avoiding an account lookup at that stage helps prevent account-enumeration behavior. The completed recovery is recorded once the recovery session is authenticated.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Next.js 16 | Full-stack React framework |
| React 19 | User interface |
| TypeScript | Type-safe application development |
| Tailwind CSS | Responsive UI styling |
| Supabase Auth | Authentication |
| PostgreSQL | Relational database |
| Supabase RLS | Database-level authorization |
| Next.js API Routes | Server-side API layer |
| Git & GitHub | Version control and source hosting |
| Vercel | Production deployment |

## Architecture

```text
Browser
   |
   v
Next.js Application
   |
   +-- React UI
   |
   +-- Protected Routes
   |
   +-- API Routes
          |
          v
      Supabase
       /    \
      /      \
Supabase Auth   PostgreSQL
                    |
                    +-- profiles
                    +-- activity_logs
                    +-- RLS policies
```

The application uses Supabase authentication to establish the current user session.

Server-side routes validate authenticated users before accessing application data. PostgreSQL Row Level Security provides an additional authorization layer at the database level.

## Project Structure

```text
app/
├── admin/
├── api/
├── auth/
├── dashboard/
├── forgot-password/
├── login/
├── register/
└── update-password/

components/
├── AppSidebar.tsx
├── Brand.tsx
└── Icons.tsx

lib/
├── auth.ts
└── supabase/
    ├── client.ts
    └── server.ts

supabase/
└── schema.sql
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Environment files containing real project values should not be committed to source control.

## Local Development

Clone the repository:

```bash
git clone https://github.com/carlossocarras9509/client-dashboard.git
```

Enter the project directory:

```bash
cd client-dashboard
```

Install dependencies:

```bash
npm install
```

Create `.env.local` and configure the required Supabase environment variables.

Run the database setup contained in:

```text
supabase/schema.sql
```

Then start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Supabase Authentication Configuration

For local development, configure the following redirect URL in Supabase:

```text
http://localhost:3000/auth/callback
```

For production, configure:

```text
https://client-dashboard-seven-bay.vercel.app/auth/callback
```

The production Site URL should be:

```text
https://client-dashboard-seven-bay.vercel.app
```

## Database

The complete database configuration is documented in:

```text
supabase/schema.sql
```

For an existing database that already has the earlier activity upgrade, run:

```text
supabase/username-audit-upgrade.sql
```

It contains the database structures required by the application, including profile management, activity tracking, role support, database triggers, and Row Level Security policies.

### Main Tables

**profiles**

Stores application-specific user information such as full name, unique username, email, company, phone number, and application role. Full names may be shared by multiple users; usernames are unique application identities.

**activity_logs**

Stores account activity associated with authenticated users. `user_id` identifies the account whose history is being viewed, while `actor_id` identifies the authenticated account that performed the action when applicable. This allows administrative changes to appear in both the administrator and affected user audit histories.

## Security

The application uses multiple authorization layers:

1. Supabase Authentication verifies user identity.
2. Next.js protected routes restrict application access.
3. API routes verify the authenticated user server-side.
4. Role checks restrict administrative functionality.
5. PostgreSQL Row Level Security controls database access.

This prevents authorization from depending only on the frontend interface.

## Production Deployment

The application is deployed using **Vercel** and connected directly to the GitHub repository.

Production environment variables are configured through Vercel rather than committed to the repository.

The production application communicates with the same Supabase backend through the configured environment variables and authorized authentication redirect URLs.

## Development Goals

This project was created to demonstrate practical experience with:

- Full-stack React/Next.js development
- TypeScript
- Authentication workflows
- REST-style API development
- PostgreSQL database design
- Database authorization and RLS
- Role-based access control
- Responsive application interfaces
- Git/GitHub workflows
- Production deployment

## Repository

Source code:

https://github.com/carlossocarras9509/client-dashboard