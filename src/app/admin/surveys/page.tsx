"use client";

import { useState } from "react";
import { useAppState, SurveyResponse } from "@/lib/state";
import { ClipboardList, Search, Eye, X, Check, XCircle, BarChart } from "lucide-react";

export default function SurveyResults() {
  const { isLoaded, surveys } = useAppState();
  const [search, setSearch] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyResponse | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-muted-foreground">Loading assessment logs...</span>
      </div>
    );
  }

  const filteredSurveys = surveys.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.occupation.toLowerCase().includes(search.toLowerCase())
  );

  // Aggregated questions statistics
  const total = surveys.length || 1;
  const brushTwice = surveys.filter((s) => s.answers.brushFrequency === "Twice a day").length;
  const flossDaily = surveys.filter((s) => s.answers.flossFrequency === "Daily").length;
  const mouthwashDaily = surveys.filter((s) => s.answers.useMouthwash === "Daily").length;
  const dentistPain = surveys.filter((s) => s.answers.dentistVisits === "Only when in pain").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-3xl tracking-tight">Survey & Assessments</h1>
        <p className="text-muted-foreground text-sm">
          Monitor responses from the free online Oral Hygiene practices and Trivia assessment.
        </p>
      </div>

      {/* Aggregate Indicators */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Brush stats */}
        <div className="bg-card border border-border p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Brush Twice a Day</span>
            <span className="text-teal-600 font-bold">{Math.round((brushTwice / total) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600"
              style={{ width: `${(brushTwice / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Floss stats */}
        <div className="bg-card border border-border p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Daily Flossing</span>
            <span className="text-teal-600 font-bold">{Math.round((flossDaily / total) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600"
              style={{ width: `${(flossDaily / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Mouthwash stats */}
        <div className="bg-card border border-border p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Daily Mouthwash</span>
            <span className="text-teal-600 font-bold">{Math.round((mouthwashDaily / total) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600"
              style={{ width: `${(mouthwashDaily / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Dentist stats */}
        <div className="bg-card border border-border p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Visit Only in Pain</span>
            <span className="text-red-500 font-bold">{Math.round((dentistPain / total) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500"
              style={{ width: `${(dentistPain / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by participant name..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card outline-none text-sm focus:border-teal-500"
        />
      </div>

      {/* Survey Results Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold">
                <th className="p-4 pl-6">Participant</th>
                <th className="p-4">Demographics</th>
                <th className="p-4">Date Completed</th>
                <th className="p-4">Trivia Answer</th>
                <th className="p-4">Correct Recommendations</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredSurveys.map((srv) => {
                const isTriviaCorrect = srv.answers.triviaAnswer === "Brush for 2 minutes, twice a day";
                return (
                  <tr key={srv.id} className="hover:bg-muted/10 transition-colors">
                    {/* Participant name */}
                    <td className="p-4 pl-6 font-bold text-slate-900 dark:text-slate-100">{srv.name}</td>
                    {/* Demographics */}
                    <td className="p-4 text-xs">
                      {srv.gender} • {srv.age} yrs • <span className="text-muted-foreground">{srv.occupation}</span>
                    </td>
                    {/* Date */}
                    <td className="p-4 text-xs text-muted-foreground">{srv.date}</td>
                    {/* Trivia Answer */}
                    <td className="p-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        {isTriviaCorrect ? (
                          <Check size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle size={14} className="text-red-500 shrink-0" />
                        )}
                        <span className={isTriviaCorrect ? "text-emerald-600 font-semibold" : "text-slate-600 dark:text-slate-400"}>
                          {srv.answers.triviaAnswer || "Skipped"}
                        </span>
                      </div>
                    </td>
                    {/* Score */}
                    <td className="p-4">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
                        {srv.correctCount} / 6 recommendations
                      </span>
                    </td>
                    {/* View Action */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedSurvey(srv)}
                        className="p-2 text-slate-500 hover:text-teal-600 bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition"
                        title="View Detailed Survey Answers"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredSurveys.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No completed survey logs found matching search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Survey details modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-teal-600 text-white rounded-t-3xl">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-teal-100">Survey Answers Log</span>
                <h2 className="font-outfit font-extrabold text-xl">{selectedSurvey.name}</h2>
              </div>
              <button
                onClick={() => setSelectedSurvey(null)}
                className="text-white hover:bg-teal-700 p-2 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div className="text-xs text-muted-foreground flex justify-between border-b border-border/60 pb-3">
                <span>Submitted at: {selectedSurvey.date}</span>
                <span>Accuracy Score: <strong className="text-teal-600 font-bold">{selectedSurvey.score}%</strong></span>
              </div>

              {/* Questions Split list */}
              <div className="space-y-4 text-sm">
                {/* 1 */}
                <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Question 1: Brushing frequency</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedSurvey.answers.brushFrequency}</p>
                </div>
                {/* 2 */}
                <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Question 2: Toothpaste usage</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedSurvey.answers.useToothpaste}</p>
                </div>
                {/* 3 */}
                <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Question 3: Flossing habit</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedSurvey.answers.flossFrequency}</p>
                </div>
                {/* 4 */}
                <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Question 4: Mouthwash habit</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedSurvey.answers.useMouthwash}</p>
                </div>
                {/* 5 */}
                <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Question 5: Dentist visits</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedSurvey.answers.dentistVisits}</p>
                </div>
                {/* Trivia */}
                <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Question 6: Correct Brushing Trivia</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    {selectedSurvey.answers.triviaAnswer === "Brush for 2 minutes, twice a day" ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Check size={14} /> Correct answer (Brush for 2 minutes, twice a day)
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle size={14} /> Incorrect answer ({selectedSurvey.answers.triviaAnswer})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
