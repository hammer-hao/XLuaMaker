import type {NodeEditor} from "rete";
import type {Schemes} from "../../types.ts";
import {DatarefSelectControl} from "../../controls/DatarefSelectControl.tsx";
import {ComparisonSelectControl} from "../../controls/ComparisonSelectControl.tsx";
import {ValueInputControl} from "../../controls/ValueInputControl.tsx";
import {CallbackSelectControl} from "../../controls/CallbackSelectControl.tsx";
import {lowerIRtoAST} from "../XLuaEmitter/AST.ts";
import {XLuaContext} from "../context/XLuaContext.ts";

export type NodeId = string;
export type EdgeId = string;
export type PortKey = string;

export interface IRNode {
    id: NodeId;
    type: string;
    value: string;
}

export interface IREdge {
    id: EdgeId;
    source: { node: NodeId; port: PortKey}
    target: { node: NodeId; port: PortKey}
}

export interface IRGraph {
    nodes: Record<NodeId, IRNode>
    edges: Record<EdgeId, IREdge>
    outAdj: Record<NodeId, EdgeId[]>
    inAdj: Record<NodeId, EdgeId[]>
    start: NodeId | undefined
}

export class IRGraphBuilder {
    private graph: IRGraph = {
        nodes: {},
        edges: {},
        outAdj: {},
        inAdj: {},
        start: undefined
    };

    addNode(node: IRNode) {
        if (this.graph.nodes[node.id]) throw new Error(`Node with id ${node.id} already exists`);
        this.graph.nodes[node.id] = node;
        this.graph.outAdj[node.id] = [];
        this.graph.inAdj[node.id] = [];
    }

    addEdge(edge: IREdge) {
        if (this.graph.edges[edge.id]) throw new Error(`Edge with id ${edge.id} already exists`);
        if (!this.graph.nodes[edge.source.node]) throw new Error(`Source node ${edge.source.node} does not exist`);
        if (!this.graph.nodes[edge.target.node]) throw new Error(`Target node ${edge.target.node} does not exist`);
        this.graph.edges[edge.id] = edge;
        this.graph.outAdj[edge.source.node].push(edge.id);
        this.graph.inAdj[edge.target.node].push(edge.id);
    }

    build(): IRGraph {
        // find the start node
        for (const node of Object.values(this.graph.nodes)) {
            if (this.graph.inAdj[node.id].length === 0)
            {
                for (const edge of this.graph.outAdj[node.id])
                {
                    if (this.graph.edges[edge].source.port === "next")
                    {
                        this.graph.start = node.id;
                        break;
                    }
                }
            }
        }
        return this.graph;
    }
}


export function buildIR(editor: NodeEditor<Schemes>){
    const builder = new IRGraphBuilder();
    const nodes = editor.getNodes();
    const edges = editor.getConnections();

    for (const node of nodes) {
        const controls = node.controls;
        var value = "";
        if (controls != undefined)
        {
            for (const control of Object.values(controls))
            if (control instanceof DatarefSelectControl || control instanceof ComparisonSelectControl
                || control instanceof ValueInputControl || control instanceof CallbackSelectControl) {
                value = control.value;
            }
        }
        builder.addNode({
            id: String(node.id),
            type: node.label,
            value: value
        })
    }

    for (const edge of edges) {
        let srcNode: NodeId = edge.source;
        if (edge.sourceOutput === "phase" || edge.sourceOutput === "duration")
        {
            console.log("Edge:", edge);
            const pseudoId = `pseudo:${edge.id}:${edge.sourceOutput}`;
            // generate fake value nodes
            builder.addNode({
                id: pseudoId,
                type: "Value Input",
                value: edge.sourceOutput
            })
            srcNode = pseudoId;
        }
        builder.addEdge({
            id: String(edge.id),
            source: { node: srcNode, port: edge.sourceOutput },
            target: { node: edge.target, port: edge.targetInput }
        })
    }

    const g = builder.build();
    console.log("Graph:", g);

    const [ast, wheretowrite] = lowerIRtoAST(g);
    console.log("AST:", ast);
    console.log("Where to write:", wheretowrite);

    const xp_context = new XLuaContext()
    xp_context.push(ast, wheretowrite);

    const out = xp_context.compile();
    console.log("Output:", out);
}