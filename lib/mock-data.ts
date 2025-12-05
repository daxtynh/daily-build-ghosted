import { CompanyStats, CompanyReport, CommunityStats } from "./db";

// Realistic mock data based on common tech company ghosting complaints
export const mockCompanyStats: CompanyStats[] = [
  {
    company_name: "Amazon",
    company_slug: "amazon",
    total_reports: 847,
    ghosted_count: 678,
    ghost_rate: 80.0,
    avg_wait_days: 32,
    responded_count: 84,
    rejected_count: 68,
    offer_count: 17,
  },
  {
    company_name: "Meta",
    company_slug: "meta",
    total_reports: 623,
    ghosted_count: 486,
    ghost_rate: 78.0,
    avg_wait_days: 28,
    responded_count: 74,
    rejected_count: 50,
    offer_count: 13,
  },
  {
    company_name: "Google",
    company_slug: "google",
    total_reports: 912,
    ghosted_count: 684,
    ghost_rate: 75.0,
    avg_wait_days: 35,
    responded_count: 137,
    rejected_count: 73,
    offer_count: 18,
  },
  {
    company_name: "Oracle",
    company_slug: "oracle",
    total_reports: 234,
    ghosted_count: 175,
    ghost_rate: 74.8,
    avg_wait_days: 41,
    responded_count: 35,
    rejected_count: 21,
    offer_count: 3,
  },
  {
    company_name: "IBM",
    company_slug: "ibm",
    total_reports: 312,
    ghosted_count: 231,
    ghost_rate: 74.0,
    avg_wait_days: 38,
    responded_count: 50,
    rejected_count: 28,
    offer_count: 3,
  },
  {
    company_name: "Salesforce",
    company_slug: "salesforce",
    total_reports: 289,
    ghosted_count: 208,
    ghost_rate: 72.0,
    avg_wait_days: 29,
    responded_count: 46,
    rejected_count: 29,
    offer_count: 6,
  },
  {
    company_name: "Microsoft",
    company_slug: "microsoft",
    total_reports: 756,
    ghosted_count: 529,
    ghost_rate: 70.0,
    avg_wait_days: 26,
    responded_count: 136,
    rejected_count: 68,
    offer_count: 23,
  },
  {
    company_name: "Apple",
    company_slug: "apple",
    total_reports: 534,
    ghosted_count: 369,
    ghost_rate: 69.1,
    avg_wait_days: 31,
    responded_count: 96,
    rejected_count: 53,
    offer_count: 16,
  },
  {
    company_name: "Netflix",
    company_slug: "netflix",
    total_reports: 178,
    ghosted_count: 121,
    ghost_rate: 68.0,
    avg_wait_days: 24,
    responded_count: 34,
    rejected_count: 18,
    offer_count: 5,
  },
  {
    company_name: "Uber",
    company_slug: "uber",
    total_reports: 267,
    ghosted_count: 181,
    ghost_rate: 67.8,
    avg_wait_days: 27,
    responded_count: 51,
    rejected_count: 29,
    offer_count: 6,
  },
  {
    company_name: "LinkedIn",
    company_slug: "linkedin",
    total_reports: 198,
    ghosted_count: 132,
    ghost_rate: 66.7,
    avg_wait_days: 22,
    responded_count: 40,
    rejected_count: 20,
    offer_count: 6,
  },
  {
    company_name: "Spotify",
    company_slug: "spotify",
    total_reports: 143,
    ghosted_count: 95,
    ghost_rate: 66.4,
    avg_wait_days: 25,
    responded_count: 29,
    rejected_count: 14,
    offer_count: 5,
  },
  {
    company_name: "Adobe",
    company_slug: "adobe",
    total_reports: 187,
    ghosted_count: 122,
    ghost_rate: 65.2,
    avg_wait_days: 28,
    responded_count: 39,
    rejected_count: 19,
    offer_count: 7,
  },
  {
    company_name: "Airbnb",
    company_slug: "airbnb",
    total_reports: 156,
    ghosted_count: 100,
    ghost_rate: 64.1,
    avg_wait_days: 23,
    responded_count: 34,
    rejected_count: 16,
    offer_count: 6,
  },
  {
    company_name: "Twitter/X",
    company_slug: "twitter-x",
    total_reports: 234,
    ghosted_count: 149,
    ghost_rate: 63.7,
    avg_wait_days: 19,
    responded_count: 51,
    rejected_count: 28,
    offer_count: 6,
  },
  {
    company_name: "Stripe",
    company_slug: "stripe",
    total_reports: 167,
    ghosted_count: 105,
    ghost_rate: 62.9,
    avg_wait_days: 21,
    responded_count: 38,
    rejected_count: 17,
    offer_count: 7,
  },
  {
    company_name: "Snap Inc",
    company_slug: "snap-inc",
    total_reports: 98,
    ghosted_count: 61,
    ghost_rate: 62.2,
    avg_wait_days: 26,
    responded_count: 22,
    rejected_count: 12,
    offer_count: 3,
  },
  {
    company_name: "Coinbase",
    company_slug: "coinbase",
    total_reports: 134,
    ghosted_count: 82,
    ghost_rate: 61.2,
    avg_wait_days: 20,
    responded_count: 32,
    rejected_count: 16,
    offer_count: 4,
  },
  {
    company_name: "Shopify",
    company_slug: "shopify",
    total_reports: 112,
    ghosted_count: 67,
    ghost_rate: 59.8,
    avg_wait_days: 18,
    responded_count: 28,
    rejected_count: 12,
    offer_count: 5,
  },
  {
    company_name: "DoorDash",
    company_slug: "doordash",
    total_reports: 89,
    ghosted_count: 52,
    ghost_rate: 58.4,
    avg_wait_days: 24,
    responded_count: 22,
    rejected_count: 12,
    offer_count: 3,
  },
];

// Generate mock reports for a company
export function generateMockReports(companySlug: string): CompanyReport[] {
  const company = mockCompanyStats.find((c) => c.company_slug === companySlug);
  if (!company) return [];

  const positions = [
    "Software Engineer",
    "Senior Software Engineer",
    "Staff Engineer",
    "Product Manager",
    "Data Scientist",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Machine Learning Engineer",
    "Engineering Manager",
    "UX Designer",
    "Technical Program Manager",
  ];

  const appliedVia = [
    "company website",
    "LinkedIn",
    "referral",
    "recruiter",
    "Indeed",
    "Glassdoor",
    "AngelList",
  ];

  const ghostedNotes = [
    "Applied 3 weeks ago, not a single response. Classic.",
    "Got an automated 'received your application' email and nothing since.",
    "Recruiter reached out, scheduled a call, then disappeared.",
    "Made it through phone screen, then radio silence.",
    "Applied to 5 different positions, ghosted on all of them.",
    "They said they'd get back to me in 2 weeks. That was 2 months ago.",
    "Had a great interview, interviewer seemed enthusiastic. Never heard back.",
    "Portal still says 'under review' after 45 days lol",
    "",
    "",
    "",
  ];

  const rejectedNotes = [
    "At least they had the courtesy to send a rejection.",
    "Generic rejection email after 3 rounds of interviews.",
    "Rejected within 24 hours. Efficient, I guess.",
    "Got rejected for 'culture fit' - whatever that means.",
    "",
    "",
  ];

  const respondedNotes = [
    "Recruiter actually responded! Miracles happen.",
    "Got a phone screen scheduled.",
    "Moving to technical round.",
    "",
    "",
  ];

  const reports: CompanyReport[] = [];
  const numReports = Math.min(company.total_reports, 50);

  for (let i = 0; i < numReports; i++) {
    const random = Math.random();
    let outcome: "ghosted" | "rejected" | "responded" | "offer";
    let notes: string;

    if (random < company.ghost_rate / 100) {
      outcome = "ghosted";
      notes = ghostedNotes[Math.floor(Math.random() * ghostedNotes.length)];
    } else if (random < (company.ghost_rate + 10) / 100) {
      outcome = "rejected";
      notes = rejectedNotes[Math.floor(Math.random() * rejectedNotes.length)];
    } else if (random < (company.ghost_rate + 20) / 100) {
      outcome = "responded";
      notes = respondedNotes[Math.floor(Math.random() * respondedNotes.length)];
    } else {
      outcome = "offer";
      notes = "Actually got an offer!";
    }

    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    reports.push({
      id: i + 1,
      company_name: company.company_name,
      company_slug: company.company_slug,
      position: positions[Math.floor(Math.random() * positions.length)],
      outcome,
      days_waited:
        Math.floor(Math.random() * 60) + (outcome === "ghosted" ? 14 : 5),
      applied_via: appliedVia[Math.floor(Math.random() * appliedVia.length)],
      notes,
      created_at: date.toISOString(),
    });
  }

  return reports.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export const mockCommunityStats: CommunityStats = {
  total_reports: mockCompanyStats.reduce((acc, c) => acc + c.total_reports, 0),
  total_companies: mockCompanyStats.length,
  overall_ghost_rate: 68.4,
  avg_wait_days: 27,
};

export const mockRecentReports: CompanyReport[] = [
  {
    id: 1,
    company_name: "Amazon",
    company_slug: "amazon",
    position: "Software Development Engineer",
    outcome: "ghosted",
    days_waited: 34,
    applied_via: "company website",
    notes: "Applied through their career portal. Got automated email, then nothing.",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    company_name: "Google",
    company_slug: "google",
    position: "Senior Software Engineer",
    outcome: "ghosted",
    days_waited: 28,
    applied_via: "referral",
    notes: "Friend referred me. Recruiter said they'd review and get back. Still waiting.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 3,
    company_name: "Meta",
    company_slug: "meta",
    position: "Product Manager",
    outcome: "rejected",
    days_waited: 21,
    applied_via: "LinkedIn",
    notes: "At least they sent a rejection email.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 4,
    company_name: "Microsoft",
    company_slug: "microsoft",
    position: "Frontend Developer",
    outcome: "responded",
    days_waited: 14,
    applied_via: "recruiter",
    notes: "Recruiter reached out! Phone screen scheduled.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 5,
    company_name: "Netflix",
    company_slug: "netflix",
    position: "Senior Backend Engineer",
    outcome: "ghosted",
    days_waited: 42,
    applied_via: "company website",
    notes: "",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];
