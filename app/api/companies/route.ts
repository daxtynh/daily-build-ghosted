import { NextRequest, NextResponse } from "next/server";
import {
  getGhostingLeaderboard,
  searchCompanies,
  isDatabaseConnected,
} from "@/lib/db";
import { mockCompanyStats } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const connected = await isDatabaseConnected();

    if (connected) {
      if (query) {
        const results = await searchCompanies(query, limit);
        return NextResponse.json(results);
      }

      const leaderboard = await getGhostingLeaderboard(limit);
      return NextResponse.json(leaderboard);
    }

    // Return mock data if database not connected
    if (query) {
      const filtered = mockCompanyStats.filter((c) =>
        c.company_name.toLowerCase().includes(query.toLowerCase())
      );
      return NextResponse.json(filtered.slice(0, limit));
    }

    return NextResponse.json(mockCompanyStats.slice(0, limit));
  } catch {
    // Return mock data on error
    return NextResponse.json(mockCompanyStats.slice(0, limit));
  }
}
