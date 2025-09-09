import { memo, useCallback, useState, useMemo } from 'react';
import { Panel, useReactFlow, type Node } from '@xyflow/react';

import { datarefs } from '../data/datarefs';
import { CALLBACK_META, type CallbackSubtype } from '../types/types';

type AddSpec = { type: Node['type']; data?: Node['data'] };

const Toolbar = memo(function Toolbar() {
    const { getViewport, addNodes } = useReactFlow();
    const [seq, setSeq] = useState(1);

    const callbackOptions = useMemo(() => Object.keys(CALLBACK_META) as
        CallbackSubtype[], []);
    const [cbSubtype, setCbSubtype] = useState<CallbackSubtype>(callbackOptions[0] ?? 'before_physics');

    const addAtCenter = useCallback((spec: AddSpec) => {
        const { x, y, zoom } = getViewport();
        const id = `n${seq}`;
        setSeq(s => s + 1);

        addNodes({
            id,
            type: spec.type,
            data: spec.data ?? {},
            position: {
                x: (window.innerWidth  / 2 - x) / zoom - 80, // ← note (screen - x) / zoom
                y: (window.innerHeight / 2 - y) / zoom - 40,
            },
        });
    }, [getViewport, addNodes, seq]);

    const addSelectedCallback = useCallback(() => {
        const meta = CALLBACK_META[cbSubtype];
        console.log(meta);
        addAtCenter({
            type: 'xplaneCallback',
            data: { subtype: cbSubtype, note: meta.desc },
        });
    }, [cbSubtype, addAtCenter]);

    return (
        <Panel position="top-left" style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => addAtCenter({ type: 'existingDataref',
                data: { value: '', datarefs: datarefs } })}>+ Dataref</button>
            {/* Callback picker */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <label htmlFor="cb-subtype" style={{ fontSize: 12, opacity: 0.8 }}>
                    Callback:
                </label>
                <select
                    id="cb-subtype"
                    value={cbSubtype}
                    onChange={(e) => setCbSubtype(e.target.value as CallbackSubtype)}
                    style={{ padding: '4px 6px' }}
                >
                    {callbackOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {CALLBACK_META[opt].label}
                        </option>
                    ))}
                </select>
                <button onClick={addSelectedCallback}>
                    + Add
                </button>
            </div>
            <button onClick={() => addAtCenter({ type: 'writeToDataref', data: {value: '', datarefs: datarefs}})}>
                + Dataref Write
            </button>
        </Panel>
    );
});

export default Toolbar;