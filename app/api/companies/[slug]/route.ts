import { NextRequest, NextResponse } from "next/server";
import {
  getCompanyBySlug,
  getCompanyReports,
  isDatabaseConnected,
} from "@/lib/db";
import { mockCompanyStats, generateMockReports } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const connected = await isDatabaseConnected();

    if (connected) {
      const company = await getCompanyBySlug(slug);
      if (!company) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
      }

      const reports = await getCompanyReports(slug);
      return NextResponse.json({ company, reports });
    }

    // Return mock data if database not connected
    const company = mockCompanyStats.find((c) => c.company_slug === slug);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const reports = generateMockReports(slug);
    return NextResponse.json({ company, reports });
  } catch {
    // Return mock data on error
    const company = mockCompanyStats.find((c) => c.company_slug === slug);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const reports = generateMockReports(slug);
    return NextResponse.json({ company, reports });
  }
}
