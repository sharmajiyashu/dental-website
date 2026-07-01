"use client";

import { useState } from "react";
import { useAppState, Enquiry } from "@/lib/state";
import { MessageSquare, Check, Eye, X, Mail } from "lucide-react";

export default function EnquiryManager() {
  const { isLoaded, enquiries, markEnquiryReplied } = useAppState();
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<"All" | "New" | "Replied">("All");

  if (!isLoaded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-muted-foreground">Loading enquiries database...</span>
      </div>
    );
  }

  const filteredEnquiries = enquiries.filter(
    (e) => filterStatus === "All" || e.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-3xl tracking-tight">Patient Enquiries</h1>
        <p className="text-muted-foreground text-sm">
          Respond to user feedback, support enquiries, and clinical partnership questions sent from the website contact form.
        </p>
      </div>

      {/* Filter and Status tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {["All", "New", "Replied"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              filterStatus === status
                ? "bg-teal-600 text-white"
                : "bg-card border border-border text-slate-600 dark:text-slate-400 hover:bg-muted"
            }`}
          >
            {status} Enquiries ({status === "All" ? enquiries.length : enquiries.filter(e => e.status === status).length})
          </button>
        ))}
      </div>

      {/* Enquiries Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold">
                <th className="p-4 pl-6">Sender Details</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Message Snippet</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-muted/10 transition-colors">
                  {/* Sender */}
                  <td className="p-4 pl-6">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{enq.name}</div>
                    <div className="text-xs text-muted-foreground">{enq.email}</div>
                  </td>
                  {/* Subject */}
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{enq.subject}</td>
                  {/* Date */}
                  <td className="p-4 text-xs text-muted-foreground">{enq.date}</td>
                  {/* Message Snippet */}
                  <td className="p-4 max-w-xs truncate text-xs text-slate-500">{enq.message}</td>
                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        enq.status === "New"
                          ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30"
                          : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedEnquiry(enq)}
                      className="p-2 text-slate-500 hover:text-teal-600 bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition"
                      title="Read Full message"
                    >
                      <Eye size={16} />
                    </button>
                    {enq.status === "New" && (
                      <button
                        onClick={() => {
                          markEnquiryReplied(enq.id);
                          alert("Enquiry status updated to Replied!");
                        }}
                        className="p-2 text-emerald-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950 rounded-lg transition"
                        title="Mark as Replied"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredEnquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No enquiries match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-teal-600 text-white rounded-t-3xl">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-teal-100">Enquiry message details</span>
                <h2 className="font-outfit font-extrabold text-xl">{selectedEnquiry.name}</h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-white hover:bg-teal-700 p-2 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail size={14} className="text-teal-600" />
                <span>Email: <strong className="text-slate-800 dark:text-slate-200">{selectedEnquiry.email}</strong></span>
              </div>
              <div className="border-t border-border pt-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Subject Line</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{selectedEnquiry.subject}</p>
              </div>
              <div className="border-t border-border pt-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Enquiry Message body</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40">
                  {selectedEnquiry.message}
                </p>
              </div>

              {selectedEnquiry.status === "New" && (
                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    onClick={() => {
                      markEnquiryReplied(selectedEnquiry.id);
                      setSelectedEnquiry({ ...selectedEnquiry, status: "Replied" });
                      alert("Enquiry status marked as Replied!");
                    }}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md hover-scale"
                  >
                    Mark as Replied
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
