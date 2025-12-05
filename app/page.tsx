"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Ghost,
  Plus,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Trash2,
  TrendingUp,
  Users,
  Mail,
  Trophy,
  ChevronRight,
  Flame,
} from "lucide-react";
import { CommunityStats, CompanyStats } from "@/lib/db";

type ApplicationStatus = "applied" | "responded" | "ghosted" | "rejected";

interface Application {
  id: string;
  company: string;
  position: string;
  dateApplied: string;
  status: ApplicationStatus;
  daysSinceApplied: number;
  notes: string;
}

const GHOST_THRESHOLD_DAYS = 14;

function calculateDaysSince(dateString: string): number {
  const applied = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - applied.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getStatusColor(status: ApplicationStatus, days: number): string {
  if (status === "responded")
    return "bg-green-500/20 text-green-400 border-green-500/30";
  if (status === "rejected")
    return "bg-red-500/20 text-red-400 border-red-500/30";
  if (status === "ghosted" || days >= GHOST_THRESHOLD_DAYS)
    return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
}

function getStatusLabel(status: ApplicationStatus, days: number): string {
  if (status === "responded") return "Responded";
  if (status === "rejected") return "Rejected";
  if (status === "ghosted" || days >= GHOST_THRESHOLD_DAYS) return "Ghosted";
  return "Waiting";
}

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(
    null
  );
  const [topGhosters, setTopGhosters] = useState<CompanyStats[]>([]);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    dateApplied: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("ghosted-applications");
    if (saved) {
      const parsed = JSON.parse(saved);
      const updated = parsed.map((app: Application) => ({
        ...app,
        daysSinceApplied: calculateDaysSince(app.dateApplied),
      }));
      setApplications(updated);
    }

    // Fetch community stats
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setCommunityStats)
      .catch(() => {});

    // Fetch top ghosters
    fetch("/api/companies?limit=5")
      .then((res) => res.json())
      .then(setTopGhosters)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem("ghosted-applications", JSON.stringify(applications));
    }
  }, [applications]);

  const addApplication = () => {
    if (!formData.company || !formData.position) return;

    const newApp: Application = {
      id: Date.now().toString(),
      company: formData.company,
      position: formData.position,
      dateApplied: formData.dateApplied,
      status: "applied",
      daysSinceApplied: calculateDaysSince(formData.dateApplied),
      notes: formData.notes,
    };

    setApplications([newApp, ...applications]);
    setFormData({
      company: "",
      position: "",
      dateApplied: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setShowForm(false);
  };

  const updateStatus = (id: string, status: ApplicationStatus) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  const deleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Email captured:", email);
      setEmailSubmitted(true);
      setShowEmailForm(false);
    }
  };

  const stats = {
    total: applications.length,
    ghosted: applications.filter(
      (a) =>
        a.status === "ghosted" ||
        (a.status === "applied" && a.daysSinceApplied >= GHOST_THRESHOLD_DAYS)
    ).length,
    responded: applications.filter((a) => a.status === "responded").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    waiting: applications.filter(
      (a) =>
        a.status === "applied" && a.daysSinceApplied < GHOST_THRESHOLD_DAYS
    ).length,
    avgWaitDays:
      applications.length > 0
        ? Math.round(
            applications.reduce((acc, a) => acc + a.daysSinceApplied, 0) /
              applications.length
          )
        : 0,
    ghostRate:
      applications.length > 0
        ? Math.round(
            (applications.filter(
              (a) =>
                a.status === "ghosted" ||
                (a.status === "applied" &&
                  a.daysSinceApplied >= GHOST_THRESHOLD_DAYS)
            ).length /
              applications.length) *
              100
          )
        : 0,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute top-20 left-10 opacity-20">
          <Ghost className="w-32 h-32 text-purple-500 animate-float" />
        </div>
        <div
          className="absolute top-40 right-20 opacity-10"
          style={{ animationDelay: "1s" }}
        >
          <Ghost className="w-48 h-48 text-blue-500 animate-float" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-12">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <Ghost className="w-8 h-8 text-purple-400" />
              <span className="font-bold text-xl text-white">Ghosted</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition text-sm"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Wall of Shame</span>
              </Link>
              <Link
                href="/report"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition"
              >
                Report a Company
              </Link>
            </div>
          </nav>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Track the Ghosters
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-2">
              See which companies ghost job applicants. Share your experience.
              Hold them accountable.
            </p>
            <p className="text-sm text-zinc-500">
              {communityStats
                ? `${communityStats.total_reports.toLocaleString()} reports on ${communityStats.total_companies} companies`
                : "Join thousands of job seekers sharing their experiences"}
            </p>
          </div>

          {/* Community Stats Banner */}
          {communityStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">
                  {communityStats.total_reports.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-500">Total Reports</div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">
                  {communityStats.total_companies}
                </div>
                <div className="text-xs text-zinc-500">Companies Tracked</div>
              </div>
              <div className="bg-zinc-900/50 border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {communityStats.overall_ghost_rate}%
                </div>
                <div className="text-xs text-zinc-500">Avg Ghost Rate</div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">
                  {communityStats.avg_wait_days}d
                </div>
                <div className="text-xs text-zinc-500">Avg Wait Time</div>
              </div>
            </div>
          )}

          {/* Top Ghosters Preview */}
          {topGhosters.length > 0 && (
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Worst Ghosters
                  </h2>
                </div>
                <Link
                  href="/leaderboard"
                  className="text-sm text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
                >
                  See all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid gap-2">
                {topGhosters.slice(0, 5).map((company, index) => (
                  <Link
                    key={company.company_slug}
                    href={`/company/${company.company_slug}`}
                    className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg hover:bg-zinc-800/50 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500 text-sm font-mono w-6">
                        #{index + 1}
                      </span>
                      <span className="text-white font-medium group-hover:text-purple-400 transition">
                        {company.company_name}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {company.total_reports} reports
                      </span>
                    </div>
                    <span
                      className={`font-bold ${
                        company.ghost_rate >= 75
                          ? "text-red-400"
                          : company.ghost_rate >= 60
                          ? "text-orange-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {company.ghost_rate}%
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-500 text-sm">Your Personal Tracker</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Personal Stats */}
          {applications.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 card-hover">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                  <Building2 className="w-4 h-4" />
                  Total Applied
                </div>
                <div className="text-3xl font-bold text-white">
                  {stats.total}
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-purple-500/30 rounded-xl p-4 card-hover">
                <div className="flex items-center gap-2 text-purple-400 text-sm mb-1">
                  <Ghost className="w-4 h-4" />
                  Ghosted
                </div>
                <div className="text-3xl font-bold text-purple-400">
                  {stats.ghosted}
                </div>
                <div className="text-xs text-zinc-500">
                  {stats.ghostRate}% ghost rate
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-green-500/30 rounded-xl p-4 card-hover">
                <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
                  <MessageSquare className="w-4 h-4" />
                  Responded
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {stats.responded}
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 card-hover">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  Avg Wait
                </div>
                <div className="text-3xl font-bold text-white">
                  {stats.avgWaitDays}d
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              <Plus className="w-5 h-5" />
              Track New Application
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Add Application
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                      placeholder="Google, Meta, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Date Applied
                    </label>
                    <input
                      type="date"
                      value={formData.dateApplied}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateApplied: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
                      rows={2}
                      placeholder="Referral from John, Applied on LinkedIn..."
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addApplication}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app) => {
                const effectiveStatus =
                  app.status === "applied" &&
                  app.daysSinceApplied >= GHOST_THRESHOLD_DAYS
                    ? "ghosted"
                    : app.status;
                return (
                  <div
                    key={app.id}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 card-hover"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-white">
                            {app.company}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(
                              effectiveStatus,
                              app.daysSinceApplied
                            )}`}
                          >
                            {getStatusLabel(
                              effectiveStatus,
                              app.daysSinceApplied
                            )}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm">{app.position}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(app.dateApplied).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {app.daysSinceApplied} days ago
                          </span>
                        </div>
                        {app.notes && (
                          <p className="text-zinc-500 text-xs mt-2 italic">
                            {app.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {app.status === "applied" && (
                          <>
                            <button
                              onClick={() => updateStatus(app.id, "responded")}
                              className="p-2 text-zinc-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition"
                              title="Mark as Responded"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, "rejected")}
                              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                              title="Mark as Rejected"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, "ghosted")}
                              className="p-2 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition"
                              title="Mark as Ghosted"
                            >
                              <Ghost className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Ghost className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No applications tracked yet.</p>
              <p className="text-zinc-600 text-sm">
                Add your first application to start tracking.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900/30 border-t border-zinc-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">
              You&apos;re Not Alone
            </h2>
            <p className="text-zinc-400">
              Based on industry data from 1,000+ job seekers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center card-hover">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-white mb-1">44%</div>
              <p className="text-zinc-400 text-sm">
                of job seekers cite ghosting as their #1 frustration
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center card-hover">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-white mb-1">21 days</div>
              <p className="text-zinc-400 text-sm">
                average time before a response (if any)
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center card-hover">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-white mb-1">100-200</div>
              <p className="text-zinc-400 text-sm">
                applications sent by average job seeker
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-t border-zinc-800 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <Mail className="w-10 h-10 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Get Notified</h2>
          <p className="text-zinc-400 mb-6">
            We&apos;re building company ghosting reports and weekly reminders.
            Get early access.
          </p>
          {emailSubmitted ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400">
              Thanks! We&apos;ll be in touch.
            </div>
          ) : showEmailForm ? (
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition font-medium"
              >
                Join
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowEmailForm(true)}
              className="px-8 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition font-medium border border-zinc-700"
            >
              Get Early Access
            </button>
          )}
        </div>
      </div>

      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/leaderboard"
                className="text-zinc-400 hover:text-white transition"
              >
                Wall of Shame
              </Link>
              <Link
                href="/report"
                className="text-zinc-400 hover:text-white transition"
              >
                Report a Company
              </Link>
            </div>
            <div className="text-center text-zinc-500 text-sm">
              <p>
                Built with frustration and solidarity. Personal data stored
                locally in your browser.
              </p>
            </div>
          </div>
          <p className="text-center mt-4 text-zinc-600 text-xs">
            Stats source: Resume Genius Job Seeker Insights Survey 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
