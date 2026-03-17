import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import { Plus, Bot, FileText, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ActionEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: any) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const { onInsertAINode, onInsertStandardNode, onDeleteEdge } = data || {};

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} className="react-flow__edge-path group-hover:stroke-indigo-400 transition-colors" />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 border-2 border-slate-600 text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-slate-700 transition-all shadow-md z-20 group">
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-900 border-white/10 text-slate-200 shadow-xl" sideOffset={5}>
                            {onInsertStandardNode && (
                                <DropdownMenuItem onClick={() => onInsertStandardNode(id)} className="hover:bg-white/5 cursor-pointer">
                                    <FileText className="w-4 h-4 mr-2 text-slate-400" />
                                    Insert Standard Node
                                </DropdownMenuItem>
                            )}
                            {onInsertAINode && (
                                <DropdownMenuItem onClick={() => onInsertAINode(id)} className="hover:bg-white/5 cursor-pointer text-green-400">
                                    <Bot className="w-4 h-4 mr-2" />
                                    Insert AI Node
                                </DropdownMenuItem>
                            )}
                            {onDeleteEdge && (
                                <DropdownMenuItem onClick={() => onDeleteEdge(id)} className="hover:bg-red-500/20 cursor-pointer text-red-500">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Connection
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
