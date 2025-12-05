# BUILD LOG: Ghosted

**Date**: December 4, 2024
**Build Time**: ~45 minutes (v1), +60 minutes (v2 community features)
**Live URL**: https://ghosted-tracker.vercel.app (pending redeploy)
**GitHub**: https://github.com/daxtynh/daily-build-ghosted

## v2.0 - Community Features Update

Transformed from a personal tracker into a **Glassdoor/Blind-style community platform** for exposing companies that ghost job applicants.

### New Features

1. **Wall of Shame Leaderboard** (`/leaderboard`)
   - Companies ranked by ghost rate
   - Search/filter companies
   - Visual indicators for severity (color-coded ghost rates)
   - Minimum 3 reports required to appear

2. **Company Detail Pages** (`/company/[slug]`)
   - Full stats breakdown (ghosted, rejected, responded, offers)
   - Recent anonymous reports with details
   - Average wait times
   - Position breakdowns

3. **Anonymous Report Submission** (`/report`)
   - Company name, position, outcome
   - Days waited, application source
   - Optional notes/story
   - Works in demo mode without database

4. **Community Stats on Homepage**
   - Total reports across all users
   - Companies tracked
   - Overall ghost rate
   - "Worst Ghosters" preview section

5. **API Routes**
   - `GET /api/stats` - Community statistics
   - `GET /api/companies` - Leaderboard with search
   - `GET /api/companies/[slug]` - Company details + reports
   - `POST /api/reports` - Submit new report

### Architecture

- **Database**: Vercel Postgres (ready to connect)
- **Mock Data**: Realistic sample data for 20 companies when DB not connected
- **Graceful Fallback**: App works fully with mock data, ready for real data when DB is added

### Tech Additions

- `@vercel/postgres` for database
- New pages: `/leaderboard`, `/company/[slug]`, `/report`
- API routes with mock data fallback
- Types exported from `lib/db.ts`

---

## v1.0 - Personal Tracker

**Ghosted** - A job application ghost tracker that helps job seekers:
- Track which companies ghost them during the job search
- See personal statistics (ghost rate, average wait time, total applications)
- Understand they're not alone with industry-wide ghosting data
- Get emotional closure by acknowledging the frustration

## The Problem

From research:
- **44% of job seekers** cite being ghosted by employers as their #1 frustration
- Average job seeker submits **100-200 applications** before landing a role
- **29% of invoices** (for freelancers) and job responses come late - average **21+ day** wait
- Existing tools (Huntr, Teal, Careerflow) focus on comprehensive tracking, not the emotional/ghosting angle

## Why This Idea Won

1. **Validated pain point**: Multiple surveys confirm ghosting is the top frustration
2. **Emotional hook**: "I've been ghosted 47 times" is inherently shareable
3. **No API keys needed**: Fully functional with just localStorage
4. **Clear niche**: Job seekers (easy to reach via Reddit, LinkedIn, Twitter)
5. **Network effects potential**: Future company ghosting reports create community data
6. **Differentiated**: No one focuses specifically on ghosting; competitors track everything

## Features Shipped

### Personal Tracker
- Add job applications (company, position, date, notes)
- Auto-detect ghosting after 14 days of no response
- Manual status updates: Responded, Rejected, Ghosted
- Personal stats dashboard:
  - Total applications
  - Ghost count & ghost rate %
  - Responded count
  - Average wait time in days
- Industry statistics section (from Resume Genius 2024 survey)
- Email signup for future features
- Dark theme with ghost branding
- Data stored locally (privacy-first)
- Vercel Analytics integrated

### Community Features (v2)
- Wall of Shame leaderboard
- Company detail pages with reports
- Anonymous report submission
- Search companies
- Community statistics

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Database**: Vercel Postgres (with mock data fallback)
- **Storage**: localStorage (personal tracker), Postgres (community)
- **Deployment**: Vercel

## Environment Variables Needed

```
# For community features - add via `vercel env add`
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```

To set up the database:
1. Run `vercel link` and `vercel env pull`
2. Create a Postgres database in Vercel dashboard
3. Run the app - tables auto-create on first query

## What's Next (If Traction)

1. **Database connection**: Add real Vercel Postgres
2. **Social sharing**: Shareable company ghost rate cards
3. **Email notifications**: Weekly digest of your applications
4. **Chrome extension**: Auto-detect applications from job boards
5. **Industry breakdowns**: Ghost rates by tech, finance, healthcare, etc.
6. **Upvote/confirm reports**: Community validation

## Decisions Made

- **No backend for personal tracker**: localStorage keeps it simple and privacy-first
- **Mock data for community**: Demonstrates the concept without requiring DB setup
- **14-day ghost threshold**: Industry average is 21 days, 14 is aggressive but realistic
- **No sign-up required**: Zero friction to start tracking
- **Dark theme**: Matches the slightly sardonic "ghost" branding
- **Industry stats included**: Creates immediate value even with 0 applications tracked

## Notes

- The ghost branding worked well - floating ghost animations add personality
- Stats section provides immediate value and validates the user's frustration
- Community features transform this from a tool into a platform
- Mock data makes it feel alive immediately - real data will compound

## Metrics to Watch

- Email signups
- Report submissions
- Leaderboard page views
- Company page views
- Return visitors
- Social shares
