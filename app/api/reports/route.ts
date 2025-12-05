import { NextRequest, NextResponse } from "next/server";
import { addReport, getRecentReports, isDatabaseConnected } from "@/lib/db";
import { mockRecentReports } from "@/lib/mock-data";

export async function GET() {
  try {
    const connected = await isDatabaseConnected();

    if (connected) {
      const reports = await getRecentReports(20);
      return NextResponse.json(reports);
    }

    // Return mock data if database not connected
    return NextResponse.json(mockRecentReports);
  } catch {
    return NextResponse.json(mockRecentReports);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.company_name || !body.position || !body.outcome) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate outcome
    const validOutcomes = ["ghosted", "rejected", "responded", "offer"];
    if (!validOutcomes.includes(body.outcome)) {
      return NextResponse.json({ error: "Invalid outcome" }, { status: 400 });
    }

    const connected = await isDatabaseConnected();

    if (!connected) {
      // In demo mode, just return success with mock data
      return NextResponse.json({
        success: true,
        demo_mode: true,
        message: "Report submitted (demo mode - connect database to persist)",
        report: {
          id: Date.now(),
          company_name: body.company_name,
          company_slug: body.company_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),
          position: body.position,
          outcome: body.outcome,
          days_waited: body.days_waited || 0,
          applied_via: body.applied_via || "website",
          notes: body.notes || "",
          created_at: new Date().toISOString(),
        },
      });
    }

    const report = await addReport({
      company_name: body.company_name,
      position: body.position,
      outcome: body.outcome,
      days_waited: body.days_waited || 0,
      applied_via: body.applied_via || "website",
      notes: body.notes || "",
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Error adding report:", error);
    return NextResponse.json(
      { error: "Failed to add report" },
      { status: 500 }
    );
  }
}
