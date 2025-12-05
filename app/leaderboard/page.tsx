"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Ghost,
  Trophy,
  TrendingDown,
  Clock,
  Users,
  Search,
  Building2,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { CompanyStats } from "@/lib/db";

export default function LeaderboardPage() {
  const [companies, setCompanies] = useState<CompanyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompanyStats[] | null>(
    null
  );

  useEffect(() => {
    fetch("/api/companies?limit=50")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults(null);
      return;
    }

    const res = await fetch(`/api/companies?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setSearchResults(data);
  };

  const displayCompanies = searchResults !== null ? searchResults : companies;

  const getGhostRateColor = (rate: number) => {
    if (rate >= 75) return "text-red-400";
    if (rate >= 60) return "text-orange-400";
    if (rate >= 45) return "text-yellow-400";
    return "text-green-400";
  };

  const getRankBadge = (index: number) => {
    if (index === 0)
      return (
        <span className="text-2xl" title="Worst Offender">
          💀
        </span>
      );
    if (index === 1)
      return (
        <span className="text-xl" title="#2">
          👻
        </span>
      );
    if (index === 2)
      return (
        <span className="text-xl" title="#3">
          😶
        </span>
      );
    return (
      <span className="text-zinc-500 font-mono text-sm">#{index + 1}</span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-purple-900/20" />

        <div className="relative max-w-5xl mx-auto px-4 pt-8 pb-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
            >
              <Ghost className="w-6 h-6" />
              <span className="font-medium">Ghosted</span>
            </Link>
            <Link
              href="/report"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition"
            >
              Report a Company
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Trophy className="w-10 h-10 text-red-400" />
              <h1 className="text-4xl font-bold text-white">Wall of Shame</h1>
            </div>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Companies ranked by how often they ghost job applicants. Based on{" "}
              {companies.reduce((acc, c) => acc + c.total_reports, 0).toLocaleString()}+ anonymous reports
              from real job seekers.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-zinc-400">75%+ ghost rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-zinc-400">60-74% ghost rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-zinc-400">45-59% ghost rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-zinc-400">&lt;45% ghost rate</span>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-16">
              <Ghost className="w-12 h-12 text-zinc-700 mx-auto mb-4 animate-pulse" />
              <p className="text-zinc-500">Loading the wall of shame...</p>
            </div>
          ) : displayCompanies.length === 0 ? (
            <div className="text-center py-16">
              <AlertTriangle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400">No companies found.</p>
              <p className="text-zinc-500 text-sm mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Be the first to report!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayCompanies.map((company, index) => (
                <Link
                  key={company.company_slug}
                  href={`/company/${company.company_slug}`}
                  className="block bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 hover:bg-zinc-900/70 transition group"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 flex justify-center">
                      {getRankBadge(index)}
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-zinc-500" />
                        <h3 className="font-semibold text-white truncate">
                          {company.company_name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {company.total_reports} reports
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {company.avg_wait_days}d avg wait
                        </span>
                      </div>
                    </div>

                    {/* Ghost Rate */}
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${getGhostRateColor(
                          company.ghost_rate
                        )}`}
                      >
                        {company.ghost_rate}%
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <TrendingDown className="w-3 h-3" />
                        ghost rate
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Note */}
          <div className="mt-12 text-center">
            <p className="text-zinc-500 text-sm">
              Companies need at least 3 reports to appear on the leaderboard.
            </p>
            <p className="text-zinc-600 text-xs mt-2">
              All reports are anonymous. Data is crowdsourced and may not
              reflect every applicant&apos;s experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
