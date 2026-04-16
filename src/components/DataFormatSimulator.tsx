"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Code, Database, Table, Zap, Info } from "lucide-react";

export default function DataFormatSimulator() {
  const [items, setItems] = useState(5);
  
  const formats = useMemo(() => {
    const data = Array.from({ length: items }).map((_, i) => ({
      id: i + 1,
      name: "Angelo Enriquez",
      email: "angelo@example.com",
      role: "Lead Developer"
    }));

    const json = JSON.stringify(data, null, 2);
    const yaml = data.map(d => `- id: ${d.id}\n  name: ${d.name}\n  email: ${d.email}\n  role: ${d.role}`).join('\n');
    const csv = "id,name,email,role\n" + data.map(d => `${d.id},${d.name},${d.email},${d.role}`).join('\n');

    // Simple token estimation (approx 4 chars per token)
    const getTokens = (str: string) => Math.ceil(str.length / 4);

    return [
      { name: "JSON", content: json, tokens: getTokens(json), color: "text-amber-400", bg: "bg-amber-400/10", icon: Code },
      { name: "YAML", content: yaml, tokens: getTokens(yaml), color: "text-indigo-400", bg: "bg-indigo-400/10", icon: Database },
      { name: "CSV", content: csv, tokens: getTokens(csv), color: "text-emerald-400", bg: "bg-emerald-400/10", icon: Table },
    ];
  }, [items]);

  return (
    <Card className="p-6 md:p-8 bg-slate-900/50 border-white/10 shadow-2xl space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-plasma-400" />
          Data Format Token Simulator
        </h3>
        <p className="text-sm text-slate-400 font-medium">
          See how output format choice (JSON vs YAML vs CSV) directly impacts your token bill.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Number of Records</label>
          <span className="text-xs font-mono font-bold text-plasma-400">{items}</span>
        </div>
        <Slider 
          value={[items]} 
          min={1} 
          max={50} 
          step={1} 
          onValueChange={([v]) => setItems(v)}
          className="py-4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map((f) => (
          <div key={f.name} className="space-y-3">
            <div className={cn("p-4 rounded-2xl border border-white/5 space-y-2", f.bg)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <f.icon className={cn("w-4 h-4", f.color)} />
                  <span className={cn("text-xs font-black uppercase tracking-widest", f.color)}>{f.name}</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-white">{f.tokens} tkns</Badge>
              </div>
              <pre className="text-[9px] font-mono text-slate-500 h-32 overflow-hidden opacity-50 leading-tight">
                {f.content}
              </pre>
            </div>
            {f.name === "CSV" && (
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-tighter text-center">
                    {(100 - (f.tokens / formats[0].tokens) * 100).toFixed(0)}% Cheaper than JSON
                </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 p-4 bg-plasma-500/5 border border-plasma-500/20 rounded-2xl text-[10px] text-slate-400 font-medium italic">
        <Info className="w-4 h-4 text-plasma-400 shrink-0" />
        CSV is often 50%+ cheaper because it eliminates repeated keys. Use it for large, flat datasets!
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
