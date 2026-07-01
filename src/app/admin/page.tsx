"use client";

import { useAppState } from "@/lib/state";
import {
  Users,
  Heart,
  ClipboardList,
  MessageSquare,
  ArrowUpRight,
  Activity,
  Smile,
  Compass,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { isLoaded, users, surveys, enquiries, getMetrics } = useAppState();

  if (!isLoaded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-muted-foreground">Loading workspace...</span>
      </div>
    );
  }

  const { totalUsers, avgHealthScore, totalSurveys, pendingEnquiries } = getMetrics();

  // Calculate demographics for charts
  const ageGroups = {
    "18-25": users.filter((u) => u.age === "18-25").length,
    "26-35": users.filter((u) => u.age === "26-35").length,
    "36-45": users.filter((u) => u.age === "36-45").length,
    "46-60": users.filter((u) => u.age === "46-60").length,
    "60+": users.filter((u) => u.age === "60+").length,
  };

  const genders = {
    Male: users.filter((u) => u.gender === "Male").length,
    Female: users.filter((u) => u.gender === "Female").length,
    Other: users.filter((u) => u.gender === "Other").length,
  };

  const maxAgeCount = Math.max(...Object.values(ageGroups), 1);
  const maxGenderCount = Math.max(...Object.values(genders), 1);

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-3xl tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm">
          Overview of registered patient demographics, survey completions, and health score stats.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between hover-scale">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Patients</span>
            <h3 className="font-outfit font-black text-3xl">{totalUsers}</h3>
          </div>
          <div className="p-4 bg-teal-500/10 text-teal-600 dark:bg-teal-950 dark:text-teal-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Health Score */}
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between hover-scale">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Avg Health Score</span>
            <h3 className="font-outfit font-black text-3xl">{avgHealthScore}%</h3>
          </div>
          <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-xl">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Total Surveys Completed */}
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between hover-scale">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Surveys Taken</span>
            <h3 className="font-outfit font-black text-3xl">{totalSurveys}</h3>
          </div>
          <div className="p-4 bg-blue-500/10 text-blue-600 dark:bg-blue-950 dark:text-blue-400 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Enquiries */}
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between hover-scale">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Unread Enquiries</span>
            <h3 className="font-outfit font-black text-3xl">{pendingEnquiries}</h3>
          </div>
          <div className="p-4 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Stats Charts & Metrics */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Demographics Bar Chart */}
        <div className="bg-card border border-border p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="font-outfit font-bold text-lg">Patient Age Distribution</h3>
            <span className="text-xs text-muted-foreground">Demographics segmentation across age groups</span>
          </div>

          <div className="space-y-4">
            {Object.entries(ageGroups).map(([group, count]) => {
              const percentage = Math.round((count / maxAgeCount) * 100);
              return (
                <div key={group} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{group} years</span>
                    <span className="text-muted-foreground">{count} patients</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 dark:bg-teal-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gender Distribution Chart */}
        <div className="bg-card border border-border p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="font-outfit font-bold text-lg">Patient Gender Breakdown</h3>
            <span className="text-xs text-muted-foreground">Comparative ratio across male, female, and other genders</span>
          </div>

          <div className="space-y-4">
            {Object.entries(genders).map(([gender, count]) => {
              const percentage = Math.round((count / maxGenderCount) * 100);
              return (
                <div key={gender} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{gender}</span>
                    <span className="text-muted-foreground">{count} patients</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lists of Recent Signups & Surveys */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Patients */}
        <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-outfit font-bold text-lg">Recent Registered Patients</h3>
              <span className="text-xs text-muted-foreground">List of newest users signed up in the app</span>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {users.slice(0, 4).map((user) => (
              <div key={user.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold leading-tight">{user.name}</h4>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user.role} • {user.age} yrs
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/30 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/30">
                    {user.healthScore}%
                  </span>
                  <span className="block text-[10px] text-muted-foreground mt-0.5">{user.registrationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Completed Assessments */}
        <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-outfit font-bold text-lg">Recent Completed Surveys</h3>
              <span className="text-xs text-muted-foreground">Newest entries from the online assessment survey</span>
            </div>
            <Link
              href="/admin/surveys"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {surveys.slice(0, 4).map((srv) => (
              <div key={srv.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                    <ClipboardList size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold leading-tight">{srv.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      Accuracy: {srv.accuracy}% • Correct: {srv.correctCount}/6
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
                    {srv.score} pts
                  </span>
                  <span className="block text-[10px] text-muted-foreground mt-0.5">{srv.date.split(" ")[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
