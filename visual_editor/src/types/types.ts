export type Dataref = {
    name: string
    type: string
    writable: boolean
    units: string
    description: string
}

export type CallbackSubtype =
    | "aircraft_load"
    | "aircraft_unload"
    | "flight_start"
    | "flight_crash"
    | "before_physics"
    | "after_physics"
    | "after_replay";

export const CALLBACK_META: Record<CallbackSubtype, {
    label: string;
    desc: string;
    color: string;
}> = {
    aircraft_load:   { label: "aircraft_load()",   desc: "Once on aircraft load (after init).", color: "#8b5cf6", },
    aircraft_unload: { label: "aircraft_unload()", desc: "Once on aircraft unload.", color: "#64748b", },
    flight_start:    { label: "flight_start()",    desc: "Each time a flight starts.", color: "#0ea5e9", },
    flight_crash:    { label: "flight_crash()",    desc: "When X-Plane detects a crash.", color: "#ef4444", },
    before_physics:  { label: "before_physics()",  desc: "Every frame (no pause/replay), before physics.", color: "#22c55e", },
    after_physics:   { label: "after_physics()",   desc: "Every frame (no pause/replay), after physics.", color: "#16a34a", },
    after_replay:    { label: "after_replay()",    desc: "Every frame in replay mode.", color: "#f59e0b", },
};

export type CallbackNodeData = {
    subtype: CallbackSubtype;
};

export type FlowType =
    | 'exec'
    | 'int'
    | 'float'
    | 'double'
    | 'vector'
    | 'data';     // generic fallback

export const TYPE_STYLE: Record<FlowType, { color: string; glow: string; shape: 'circle'|'diamond'|'square'|'hex'|'pill' }> = {
    exec:    { color: '#ffffff', glow: 'rgba(255,255,255,0.7)', shape: 'pill'    },
    int:  { color: '#0ea5e9', glow: 'rgba(14,165,233,0.5)',  shape: 'circle'  },
    float: { color: '#22c55e', glow: 'rgba(34,197,94,0.5)',   shape: 'diamond' },
    double:  { color: '#f59e0b', glow: 'rgba(245,158,11,0.45)', shape: 'square'  },
    vector: { color: '#a855f7', glow: 'rgba(168,85,247,0.5)',  shape: 'hex'     },
    data:    { color: '#94a3b8', glow: 'rgba(148,163,184,0.45)',shape: 'circle'  },
};