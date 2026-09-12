"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { History, Zap, Coins, CheckCircle, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.history) setHistory(data.history);
      })
      .catch((err) => console.error("History fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-white flex items-center gap-3">
          <History className="w-7 h-7 text-cyan-400" />
          CHRONICLES OF VICTORY
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Chronological ledger of completed real-life quests and acquired rewards
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-surface/60 border border-white/5" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <Card className="text-center py-16 px-6 border-dashed border-white/10">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold font-mono text-white mb-1">
            NO ADVENTURES LOGGED YET
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Complete your first quest from the dashboard or quest board to start writing your chronicle.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((record) => (
            <Card
              key={record._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface/90 border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-sans text-white">
                    {record.questTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono text-slate-400">
                    <Badge variant="neutral" size="sm">
                      {record.category}
                    </Badge>
                    <span>&bull;</span>
                    <span className="text-cyan-400 uppercase font-semibold">
                      +{record.attribute}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(record.completedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs pl-13 sm:pl-0">
                <span className="flex items-center gap-1 text-violet-300 font-bold">
                  <Zap className="w-3.5 h-3.5 text-violet-400" />
                  +{record.xpEarned} XP
                </span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  +{record.goldEarned} Gold
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
