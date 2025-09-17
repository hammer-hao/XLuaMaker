import type {IRGraph, IRNode, NodeId} from "../IR/IR.tsx";
import {
    AddExpr, DatarefExpr, DivideExpr,
    type ExpressionEmitter,
    MultiplyExpr,
    StatementBlock,
    type StatementEmitter,
    SubtractExpr
} from "./emitters.ts";

const EXEC_OUT_PORTS = new Set(["next", "then", "else"]);
const THEN_PORT = "then";
const ELSE_PORT = "else";

function getExecSuccessorIDs(g: IRGraph, n: NodeId): NodeId[] {
    return (g.outAdj[n] ?? [])
        .map(edge_id => g.edges[edge_id])
        .filter(edge => EXEC_OUT_PORTS.has(edge.source.port))
        .map(edge => edge.target.node);
}

function getExecPredecessorIDs(g: IRGraph, n: NodeId): NodeId[] {
    return (g.inAdj[n] ?? [])
        .map(edge_id => g.edges[edge_id])
        .filter(edge => EXEC_OUT_PORTS.has(edge.source.port))
        .map(edge => edge.source.node);
}

function isExitNode(g: IRGraph, n: NodeId)
{
    return getExecSuccessorIDs(g, n).length === 0;
}

export function computeImmediatePostDominators(g: IRGraph): Record<NodeId, NodeId | undefined> {
    const nodes = Object.keys(g.nodes);
    const successors: Record<NodeId, NodeId[]> = {}; // immediate post successors
    const predecessors: Record<NodeId, NodeId[]> = {}; // immediate predecessors
    for (const n of nodes) {
        successors[n] = getExecSuccessorIDs(g, n);
        for (const s of successors[n])
        {
            (predecessors[s] ??= []).push(n);
        }
    }

    const all = new Set(nodes);
    const allPostDominators: Record<NodeId, Set<NodeId>> = {};
    for (const n of nodes) {
        allPostDominators[n] = isExitNode(g, n) ? new Set([n]) : new Set(all);
    }

    let changed = true;
    while (changed) {
        changed = false;
        for (const n of nodes) {
            const s = successors[n];
            const inter =
                s.length === 0 ?
                    new Set<NodeId>() :
                    s.map(x => allPostDominators[x]).reduce((acc, set) => {
                        const next = new Set<NodeId>();
                        for (const v of acc) if (set.has(v)) next.add(v);
                        return next;
                    }, new Set<NodeId>(allPostDominators[s[0]]));
            inter.add(n);

            if (inter.size != allPostDominators[n].size || [...inter].some(v => !allPostDominators[n].has(v))) {
                changed = true;
                allPostDominators[n] = inter;
            }
        }
    }

    const result: Record<NodeId, NodeId | undefined> = {};
    for (const n of nodes) {
        const candidates = [...allPostDominators[n]].filter(x => x !== n);
        let best: NodeId | undefined = undefined;
        for (const candidate of candidates) {
            let isImmediate = true;
            for (const d of candidates)
            {
                if (d == candidate) continue;
                if (allPostDominators[d].has(candidate)) {
                    isImmediate = false;
                    break;
                }
            }
            if (isImmediate) {
                best = candidate;
                break;
            }
        }
        result[n] = best;
    }

    return result;
}

// find the node id of the input node
function inputSrcNode(g: IRGraph, nodeId: NodeId, inputPort: string): NodeId {
    const edgeId = (g.inAdj[nodeId] ?? []).find(eid => g.edges[eid].target.port === inputPort);
    if (!edgeId) throw new Error(`Missing input at ${nodeId}.${inputPort}`);
    return g.edges[edgeId].source.node;
}

function nodeToExprEmitter(g: IRGraph, nid: NodeId): ExpressionEmitter
{
    const node = g.nodes[nid];

    switch (node.type) {
        case "add": {
            const input_one = exprFromInput(g, nid, "in1");
            const input_two = exprFromInput(g, nid, "in2");
            return new AddExpr(input_one, input_two);
        }
        case "subtract" {
            const input_one = exprFromInput(g, nid, "in1");
            const input_two = exprFromInput(g, nid, "in2");
            return new SubtractExpr(input_one, input_two);
        }
        case "multiply": {
            const input_one = exprFromInput(g, nid, "in1");
            const input_two = exprFromInput(g, nid, "in2");
            return new MultiplyExpr(input_one, input_two);
        }
        case "divide": {
            const input_one = exprFromInput(g, nid, "in1");
            const input_two = exprFromInput(g, nid, "in2");
            return new DivideExpr(input_one, input_two);
        }
        case "dataref": {
            return new DatarefExpr(node.value);
        }
        case "Value Input": {
            return new ValueExpr(node.value);
        }
    }
}

// Build an ExpressionEmitter for an input port of a node
function exprFromInput(g: IRGraph, nodeId: NodeId, inputPort: string): ExpressionEmitter {
    // Example: assume the source node’s `value` already holds a Lua literal/expression
    const inEdgeId = (g.inAdj[nodeId] ?? []).find(eid => g.edges[eid].target.port === inputPort);
    if (!inEdgeId) throw new Error(`Missing expression at ${nodeId}.${inputPort}`);
    const src = g.edges[inEdgeId].source.node;
    const code = g.nodes[src].value;
    return { emitExpr: () => code };
}

export function lowerIRGraph(g: IRGraph, immediatePostDominators: Record<NodeId, NodeId | undefined>,
                             start?: NodeId, stop?: NodeId): StatementBlock
{
    const out: StatementEmitter[] = [];
    let curr: NodeId | undefined = g.start;

    while (curr && curr !== stop)
    {
        const node = g.nodes[curr];

        if (node.type === "if-else") {

        }
    }

    return new StatementBlock(out);
}

export function lowerIRtoAST(g: IRGraph): StatementBlock
{
    if (!g.start) throw new Error("IRGraph has no start node");
    const postDominators = computeImmediatePostDominators(g);

}