import {
    ReactFlow,
    Controls,
    Background,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge
} from '@xyflow/react';
import { useState, useCallback } from 'react';
import { datarefs } from './data/datarefs';
import '@xyflow/react/dist/style.css';
import ExistingDatarefNode from './nodes/existingDataref';
import WriteToDatarefNode from './nodes/writeToDataref';
import CallbackNode from './nodes/callbacks';
import Toolbar from './components/toolbar';

const nodeTypes = {
    existingDataref: ExistingDatarefNode,
    xplaneCallback: CallbackNode,
    writeToDataref: WriteToDatarefNode,
}

console.log(datarefs);

function Flow() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    )

    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    )

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
    )

    return (
        <div style={{ height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
                <Toolbar />
            </ReactFlow>
        </div>
    );
}

export default Flow;
