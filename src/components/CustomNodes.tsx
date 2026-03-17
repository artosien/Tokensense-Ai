import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Cpu, FileText, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

function formatUSD(val: number): string {
    if (val < 0.01 && val > 0) return `$${val.toFixed(4)}`;
    return `$${val.toFixed(2)}`;
}

export function AINode({ data, isConnectable }: any) {
    const { label, description, detail, onLabelChange, onDelete } = data;

    return (
        <div className="relative w-48 shrink-0 rounded-xl border p-3 flex flex-col group transition-all shadow-lg bg-slate-900/90 border-green-500/50 shadow-green-500/10">
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 !bg-green-500 border-none" />

            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full whitespace-nowrap z-10 shadow-sm pointer-events-none">
                AI Node
            </div>

            <button
                onClick={onDelete}
                className="absolute -top-2 -right-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-20"
                title="Remove Node"
            >
                <Trash2 className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded flex-shrink-0 bg-green-500/20 text-green-400">
                    <Cpu className="w-3.5 h-3.5" />
                </div>
                <Input
                    value={label}
                    onChange={(e) => onLabelChange(e.target.value)}
                    className="h-6 px-1.5 py-0 text-xs font-semibold bg-transparent border-transparent hover:border-white/20 focus-visible:ring-1 focus-visible:ring-green-500 flex-1 text-slate-100 min-w-0"
                />
            </div>
            <div className="text-[10px] text-slate-400 mb-2 truncate px-1">
                {description}
            </div>
            <div className="rounded bg-green-950/40 p-1.5 text-[9px] text-green-200/70 border border-green-500/20 flex flex-col gap-1.5 nodrag cursor-default">
                <div className="flex justify-between px-1">
                    <span>In: {detail?.inputTokens?.toLocaleString() || 0} tk</span>
                    <span>Out: {detail?.outputTokens?.toLocaleString() || 0} tk</span>
                </div>
                <div className="border-t border-green-500/20 pt-1 text-green-400 font-mono text-center font-semibold">
                    {formatUSD(detail?.nodeCost || 0)} / run
                </div>
            </div>
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 !bg-green-500 border-none" />
        </div>
    );
}

export function StandardNode({ data, isConnectable }: any) {
    const { label, description, onLabelChange, onDelete } = data;

    return (
        <div className="relative w-48 shrink-0 rounded-xl border p-3 flex flex-col group transition-all shadow-lg bg-slate-900/90 border-slate-700 shadow-black/20">
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 !bg-slate-400 border-none" />

            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full whitespace-nowrap z-10 shadow-sm pointer-events-none">
                Standard Logic
            </div>

            <button
                onClick={onDelete}
                className="absolute -top-2 -right-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-20"
                title="Remove Node"
            >
                <Trash2 className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded flex-shrink-0 bg-white/10 text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                </div>
                <Input
                    value={label}
                    onChange={(e) => onLabelChange(e.target.value)}
                    className="h-6 px-1.5 py-0 text-xs font-semibold bg-transparent border-transparent hover:border-white/20 focus-visible:ring-1 focus-visible:ring-indigo-500 flex-1 text-slate-100 min-w-0"
                />
            </div>
            <div className="text-[10px] text-slate-400 mb-2 truncate px-1">
                {description}
            </div>
            <div className="rounded bg-white/5 p-1.5 text-[9px] text-slate-500 border border-white/5 flex flex-col gap-1.5 nodrag cursor-default">
                <div className="text-center px-1">
                    Standard Logic (No Token Cost)
                </div>
            </div>
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 !bg-slate-400 border-none" />
        </div>
    );
}

export const nodeTypes = {
    ai: AINode,
    standard: StandardNode,
};
