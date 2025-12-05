import { NextResponse } from "next/server";
import { getCommunityStats, isDatabaseConnected } from "@/lib/db";
import { mockCommunityStats } from "@/lib/mock-data";

export async function GET() {
  try {
    const connected = await isDatabaseConnected();

    if (connected) {
      const stats = await getCommunityStats();
      return NextResponse.json(stats);
    }

    // Return mock data if database not connected
    return NextResponse.json(mockCommunityStats);
  } catch {
    // Return mock data on error
    return NextResponse.json(mockCommunityStats);
  }
}
