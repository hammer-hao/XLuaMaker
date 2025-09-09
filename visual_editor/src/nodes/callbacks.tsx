import { memo, useMemo } from "react";
import { Position, type NodeProps } from "@xyflow/react";
import { CALLBACK_META, type CallbackNodeData } from "../types/types.ts";
import { TypedHandle } from "../handles/TypedHandle.tsx";

export default memo(function CallbackNode({ data, isConnectable }: NodeProps<CallbackNodeData>) {
    const meta = useMemo(() => CALLBACK_META[data.subtype], [data.subtype]);
    return (
        <div
            className="callback-node"
            style={{
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: 10,
                background: '#ffffff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                maxWidth: 420,
                position: 'relative',
            }}
        >
            {/* Header (mirrors the simple label area on ExistingDatarefNode) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: meta.color }}>{meta.label}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{meta.desc}</div>
            </div>

            {/* Single event output, visually aligned like a simple row */}
            <div
                style={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                }}
            >
        <span
            style={{
                fontSize: 11,
                padding: '2px 6px',
                borderRadius: 999,
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                whiteSpace: 'nowrap',
            }}
            title="Event trigger"
        >
          event
        </span>
                <TypedHandle
                    id="exec:out"
                    flowType="exec"
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
            </div>
        </div>
    );
});