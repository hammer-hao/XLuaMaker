import { memo, useCallback, useState } from 'react';
import { Panel, useReactFlow, type Node } from '@xyflow/react';

import { datarefs } from '../data/datarefs';

type AddSpec = { type: Node['type']; data?: Node['data'] };

const Toolbar = memo(function Toolbar() {
    const { getViewport, addNodes } = useReactFlow();
    const [seq, setSeq] = useState(1);

    const addAtCenter = useCallback((spec: AddSpec) => {
        const { x, y, zoom } = getViewport();
        const id = `n${seq}`;
        setSeq(s => s + 1);

        console.log("Adding new node: ");
        console.log("id = " + id );
        console.log("x = " + x);
        console.log("y = " + y);

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

    return (
        <Panel position="top-left" style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => addAtCenter({ type: 'existingDataref', data: { value: '', datarefs: datarefs } })}>+ Dataref</button>
        </Panel>
    );
});

export default Toolbar;