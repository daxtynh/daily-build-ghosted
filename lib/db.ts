import { sql } from "@vercel/postgres";

// Types
export interface CompanyReport {
  id: number;
  company_name: string;
  company_slug: string;
  position: string;
  outcome: "ghosted" | "rejected" | "responded" | "offer";
  days_waited: number;
  applied_via: string;
  notes: string;
  created_at: string;
}

export interface CompanyStats {
  company_name: string;
  company_slug: string;
  total_reports: number;
  ghosted_count: number;
  ghost_rate: number;
  avg_wait_days: number;
  responded_count: number;
  rejected_count: number;
  offer_count: number;
}

export interface CommunityStats {
  total_reports: number;
  total_companies: number;
  overall_ghost_rate: number;
  avg_wait_days: number;
}

// Check if database is connected
export async function isDatabaseConnected(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Initialize database tables
export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS company_reports (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      company_slug VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      outcome VARCHAR(50) NOT NULL CHECK (outcome IN ('ghosted', 'rejected', 'responded', 'offer')),
      days_waited INTEGER DEFAULT 0,
      applied_via VARCHAR(100) DEFAULT 'website',
      notes TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_company_slug ON company_reports(company_slug)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_outcome ON company_reports(outcome)
  `;
}

// Helper to create slug from company name
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Add a new report
export async function addReport(report: {
  company_name: string;
  position: string;
  outcome: "ghosted" | "rejected" | "responded" | "offer";
  days_waited: number;
  applied_via: string;
  notes: string;
}): Promise<CompanyReport> {
  const slug = createSlug(report.company_name);

  const result = await sql`
    INSERT INTO company_reports (company_name, company_slug, position, outcome, days_waited, applied_via, notes)
    VALUES (${report.company_name}, ${slug}, ${report.position}, ${report.outcome}, ${report.days_waited}, ${report.applied_via}, ${report.notes})
    RETURNING *
  `;

  return result.rows[0] as CompanyReport;
}

// Get leaderboard (worst ghosting companies)
export async function getGhostingLeaderboard(
  limit: number = 20
): Promise<CompanyStats[]> {
  const result = await sql`
    SELECT
      company_name,
      company_slug,
      COUNT(*) as total_reports,
      SUM(CASE WHEN outcome = 'ghosted' THEN 1 ELSE 0 END) as ghosted_count,
      ROUND(SUM(CASE WHEN outcome = 'ghosted' THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric * 100, 1) as ghost_rate,
      ROUND(AVG(days_waited), 0) as avg_wait_days,
      SUM(CASE WHEN outcome = 'responded' THEN 1 ELSE 0 END) as responded_count,
      SUM(CASE WHEN outcome = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
      SUM(CASE WHEN outcome = 'offer' THEN 1 ELSE 0 END) as offer_count
    FROM company_reports
    GROUP BY company_name, company_slug
    HAVING COUNT(*) >= 3
    ORDER BY ghost_rate DESC, total_reports DESC
    LIMIT ${limit}
  `;

  return result.rows as CompanyStats[];
}

// Get company details
export async function getCompanyBySlug(
  slug: string
): Promise<CompanyStats | null> {
  const result = await sql`
    SELECT
      company_name,
      company_slug,
      COUNT(*) as total_reports,
      SUM(CASE WHEN outcome = 'ghosted' THEN 1 ELSE 0 END) as ghosted_count,
      ROUND(SUM(CASE WHEN outcome = 'ghosted' THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric * 100, 1) as ghost_rate,
      ROUND(AVG(days_waited), 0) as avg_wait_days,
      SUM(CASE WHEN outcome = 'responded' THEN 1 ELSE 0 END) as responded_count,
      SUM(CASE WHEN outcome = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
      SUM(CASE WHEN outcome = 'offer' THEN 1 ELSE 0 END) as offer_count
    FROM company_reports
    WHERE company_slug = ${slug}
    GROUP BY company_name, company_slug
  `;

  return (result.rows[0] as CompanyStats) || null;
}

// Get reports for a company
export async function getCompanyReports(
  slug: string,
  limit: number = 50
): Promise<CompanyReport[]> {
  const result = await sql`
    SELECT *
    FROM company_reports
    WHERE company_slug = ${slug}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return result.rows as CompanyReport[];
}

// Get overall community stats
export async function getCommunityStats(): Promise<CommunityStats> {
  const result = await sql`
    SELECT
      COUNT(*) as total_reports,
      COUNT(DISTINCT company_slug) as total_companies,
      ROUND(SUM(CASE WHEN outcome = 'ghosted' THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric * 100, 1) as overall_ghost_rate,
      ROUND(AVG(days_waited), 0) as avg_wait_days
    FROM company_reports
  `;

  const row = result.rows[0];
  return {
    total_reports: Number(row.total_reports) || 0,
    total_companies: Number(row.total_companies) || 0,
    overall_ghost_rate: Number(row.overall_ghost_rate) || 0,
    avg_wait_days: Number(row.avg_wait_days) || 0,
  };
}

// Search companies
export async function searchCompanies(
  query: string,
  limit: number = 10
): Promise<CompanyStats[]> {
  const searchPattern = `%${query}%`;

  const result = await sql`
    SELECT
      company_name,
      company_slug,
      COUNT(*) as total_reports,
      SUM(CASE WHEN outcome = 'ghosted' THEN 1 ELSE 0 END) as ghosted_count,
      ROUND(SUM(CASE WHEN outcome = 'ghosted' THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric * 100, 1) as ghost_rate,
      ROUND(AVG(days_waited), 0) as avg_wait_days,
      SUM(CASE WHEN outcome = 'responded' THEN 1 ELSE 0 END) as responded_count,
      SUM(CASE WHEN outcome = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
      SUM(CASE WHEN outcome = 'offer' THEN 1 ELSE 0 END) as offer_count
    FROM company_reports
    WHERE company_name ILIKE ${searchPattern}
    GROUP BY company_name, company_slug
    ORDER BY total_reports DESC
    LIMIT ${limit}
  `;

  return result.rows as CompanyStats[];
}

// Get recent reports
export async function getRecentReports(
  limit: number = 20
): Promise<CompanyReport[]> {
  const result = await sql`
    SELECT *
    FROM company_reports
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return result.rows as CompanyReport[];
}
