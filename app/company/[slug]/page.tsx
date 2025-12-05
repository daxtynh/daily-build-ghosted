"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Ghost,
  Building2,
  Clock,
  Users,
  TrendingDown,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Award,
  ArrowLeft,
  Calendar,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { CompanyStats, CompanyReport } from "@/lib/db";

function getOutcomeIcon(outcome: string) {
  switch (outcome) {
    case "ghosted":
      return <Ghost className="w-4 h-4 text-purple-400" />;
    case "rejected":
      return <XCircle className="w-4 h-4 text-red-400" />;
    case "responded":
      return <MessageSquare className="w-4 h-4 text-blue-400" />;
    case "offer":
      return <Award className="w-4 h-4 text-green-400" />;
    default:
      return null;
  }
}

function getOutcomeColor(outcome: string) {
  switch (outcome) {
    case "ghosted":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "rejected":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "responded":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "offer":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [company, setCompany] = useState<CompanyStats | null>(null);
  const [reports, setReports] = useState<CompanyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/companies/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setCompany(data.company);
        setReports(data.reports);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Ghost className="w-12 h-12 text-zinc-700 animate-pulse" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Ghost className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">
            Company Not Found
          </h1>
          <p className="text-zinc-400 mb-6">
            No reports yet for this company.
          </p>
          <Link
            href="/leaderboard"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            ← Back to leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const ghostRateColor =
    company.ghost_rate >= 75
      ? "text-red-400"
      : company.ghost_rate >= 60
      ? "text-orange-400"
      : company.ghost_rate >= 45
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />

        <div className="relative max-w-5xl mx-auto px-4 pt-8 pb-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to leaderboard</span>
            </Link>
            <Link
              href={`/report?company=${encodeURIComponent(company.company_name)}`}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition"
            >
              Report This Company
            </Link>
          </div>

          {/* Company Header */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-8 h-8 text-purple-400" />
                  <h1 className="text-3xl font-bold text-white">
                    {company.company_name}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.total_reports} reports
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {company.avg_wait_days} day avg wait
                  </span>
                </div>
              </div>

              <div className="text-center md:text-right">
                <div className={`text-5xl font-bold ${ghostRateColor}`}>
                  {company.ghost_rate}%
                </div>
                <div className="flex items-center justify-center md:justify-end gap-1 text-zinc-500 text-sm">
                  <TrendingDown className="w-4 h-4" />
                  ghost rate
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900/50 border border-purple-500/30 rounded-xl p-4 text-center">
              <Ghost className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">
                {company.ghosted_count}
              </div>
              <div className="text-xs text-zinc-500">Ghosted</div>
            </div>
            <div className="bg-zinc-900/50 border border-red-500/30 rounded-xl p-4 text-center">
              <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">
                {company.rejected_count}
              </div>
              <div className="text-xs text-zinc-500">Rejected</div>
            </div>
            <div className="bg-zinc-900/50 border border-blue-500/30 rounded-xl p-4 text-center">
              <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">
                {company.responded_count}
              </div>
              <div className="text-xs text-zinc-500">Responded</div>
            </div>
            <div className="bg-zinc-900/50 border border-green-500/30 rounded-xl p-4 text-center">
              <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {company.offer_count}
              </div>
              <div className="text-xs text-zinc-500">Offers</div>
            </div>
          </div>

          {/* Reports */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Recent Reports
            </h2>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800 rounded-xl">
              <Ghost className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400">No detailed reports yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${getOutcomeColor(
                            report.outcome
                          )}`}
                        >
                          {getOutcomeIcon(report.outcome)}
                          <span className="capitalize">{report.outcome}</span>
                        </span>
                        <span className="text-zinc-500 text-xs">
                          {formatTimeAgo(report.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-zinc-500" />
                        <span className="text-white font-medium">
                          {report.position}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Waited {report.days_waited} days
                        </span>
                        <span className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          via {report.applied_via}
                        </span>
                      </div>

                      {report.notes && (
                        <p className="text-zinc-400 text-sm mt-3 italic border-l-2 border-zinc-700 pl-3">
                          &quot;{report.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-zinc-800 rounded-2xl p-8">
            <Ghost className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Applied to {company.company_name}?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Help other job seekers by sharing your experience. All reports are
              anonymous.
            </p>
            <Link
              href={`/report?company=${encodeURIComponent(company.company_name)}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition"
            >
              <MessageSquare className="w-5 h-5" />
              Share Your Experience
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
