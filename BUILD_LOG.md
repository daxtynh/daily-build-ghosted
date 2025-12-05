# BUILD LOG: Ghosted

**Date**: December 4, 2024
**Build Time**: ~45 minutes
**Live URL**: https://ghosted-tracker-befxnt2l8-daxtynhs-projects.vercel.app
**GitHub**: https://github.com/daxtynh/daily-build-ghosted

## What Was Built

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

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Storage**: localStorage (no backend needed)
- **Deployment**: Vercel

## What's Next (If Traction)

1. **Company ghosting reports**: Crowdsourced data on which companies ghost most
2. **Follow-up reminders**: Email/push notifications after X days
3. **Export/share stats**: "My job search stats" shareable cards
4. **Backend + auth**: Sync across devices, anonymous community data
5. **Chrome extension**: Auto-detect applications from job boards

## Decisions Made

- **No backend for MVP**: localStorage keeps it simple and privacy-first
- **14-day ghost threshold**: Industry average is 21 days, 14 is aggressive but realistic
- **No sign-up required**: Zero friction to start tracking
- **Dark theme**: Matches the slightly sardonic "ghost" branding
- **Industry stats included**: Creates immediate value even with 0 applications tracked

## Notes

- The ghost branding worked well - floating ghost animations add personality
- Stats section provides immediate value and validates the user's frustration
- Email capture at bottom for future feature announcements
- Build was smooth - no external APIs needed

## Metrics to Watch

- Email signups
- Number of applications tracked per user (via Analytics custom events - could add)
- Return visitors
- Social shares (if people share their ghost rate)
