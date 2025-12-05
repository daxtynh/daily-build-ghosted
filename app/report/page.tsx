"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Ghost,
  Building2,
  Briefcase,
  Clock,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  ArrowLeft,
  Send,
  AlertCircle,
} from "lucide-react";

function ReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCompany = searchParams.get("company") || "";

  const [formData, setFormData] = useState({
    company_name: prefilledCompany,
    position: "",
    outcome: "" as "ghosted" | "rejected" | "responded" | "offer" | "",
    days_waited: "",
    applied_via: "company website",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (prefilledCompany) {
      setFormData((prev) => ({ ...prev, company_name: prefilledCompany }));
    }
  }, [prefilledCompany]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.company_name || !formData.position || !formData.outcome) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          days_waited: parseInt(formData.days_waited) || 0,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
    } catch {
      setError("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-500/20 border border-green-500/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Report Submitted!
          </h1>
          <p className="text-zinc-400 mb-8">
            Thanks for helping other job seekers. Your anonymous report has been
            added to our database.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/leaderboard"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition"
            >
              View Leaderboard
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  company_name: "",
                  position: "",
                  outcome: "",
                  days_waited: "",
                  applied_via: "company website",
                  notes: "",
                });
              }}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />

        <div className="relative max-w-2xl mx-auto px-4 pt-8 pb-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <Ghost className="w-5 h-5" />
              <span className="font-medium">Ghosted</span>
            </Link>
            <Link
              href="/leaderboard"
              className="text-zinc-400 hover:text-white text-sm transition"
            >
              View Leaderboard →
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-3">
              Report a Company
            </h1>
            <p className="text-zinc-400 max-w-md mx-auto">
              Share your experience anonymously to help other job seekers know
              what to expect.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6"
          >
            {/* Company */}
            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                <Building2 className="w-4 h-4" />
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                placeholder="e.g., Google, Amazon, Meta..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Position */}
            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                <Briefcase className="w-4 h-4" />
                Position Applied For *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder="e.g., Software Engineer, Product Manager..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Outcome */}
            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                <Ghost className="w-4 h-4" />
                What Happened? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "ghosted",
                    label: "Ghosted",
                    icon: Ghost,
                    color: "purple",
                  },
                  {
                    value: "rejected",
                    label: "Rejected",
                    icon: AlertCircle,
                    color: "red",
                  },
                  {
                    value: "responded",
                    label: "Responded",
                    icon: MessageSquare,
                    color: "blue",
                  },
                  {
                    value: "offer",
                    label: "Got Offer",
                    icon: CheckCircle2,
                    color: "green",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        outcome: option.value as typeof formData.outcome,
                      })
                    }
                    className={`flex items-center gap-2 p-4 rounded-xl border transition ${
                      formData.outcome === option.value
                        ? `bg-${option.color}-500/20 border-${option.color}-500/50 text-${option.color}-400`
                        : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    <option.icon className="w-5 h-5" />
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Days Waited */}
            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                <Clock className="w-4 h-4" />
                How Many Days Did You Wait?
              </label>
              <input
                type="number"
                value={formData.days_waited}
                onChange={(e) =>
                  setFormData({ ...formData, days_waited: e.target.value })
                }
                placeholder="e.g., 14, 30, 60..."
                min="0"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Applied Via */}
            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                <ExternalLink className="w-4 h-4" />
                How Did You Apply?
              </label>
              <select
                value={formData.applied_via}
                onChange={(e) =>
                  setFormData({ ...formData, applied_via: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="company website">Company Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="referral">Referral</option>
                <option value="recruiter">Recruiter Reached Out</option>
                <option value="Indeed">Indeed</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="AngelList">AngelList / Wellfound</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                <MessageSquare className="w-4 h-4" />
                Share More Details (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="e.g., Made it to 3rd round then nothing. Recruiter said they'd get back in a week..."
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg p-4 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-medium transition shadow-lg shadow-purple-500/25"
            >
              {submitting ? (
                <>
                  <Ghost className="w-5 h-5 animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Anonymous Report
                </>
              )}
            </button>

            {/* Privacy Note */}
            <p className="text-center text-xs text-zinc-500">
              Your report is completely anonymous. We don&apos;t collect any
              personal information.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <Ghost className="w-12 h-12 text-zinc-700 animate-pulse" />
        </div>
      }
    >
      <ReportForm />
    </Suspense>
  );
}
