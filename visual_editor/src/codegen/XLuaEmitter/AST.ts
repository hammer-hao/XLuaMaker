import type {IRGraph, NodeId} from "../IR/IR.tsx";
import {
    AddExpr, AndExpr, CompareExpr, DatarefExpr, DivideExpr,
    type ExpressionEmitter, IfStmt,
    MultiplyExpr, NotExpr, OrExpr,
    StatementBlock,
    type StatementEmitter,
    SubtractExpr, ValueExpr, WriteToDataref
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

// find the node id of the output node
function outputNode(g: IRGraph, nodeId: NodeId, outputPort: string): NodeId | undefined {
    const edgeId = (g.outAdj[nodeId] ?? []).find(eid => g.edges[eid].source.port === outputPort);
    return edgeId ? g.edges[edgeId].target.node : undefined;
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
        case "subtract": {
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
        case "not": {
            const input_one = exprFromInput(g, nid, "in1");
            return new NotExpr(input_one);
        }
        case "and": {
            const input_one = exprFromInput(g, nid, "in1");
            const input_two = exprFromInput(g, nid, "in2");
            return new AndExpr(input_one, input_two);
        }
        case "or": {
            const input_one = exprFromInput(g, nid, "in1");
            const input_two = exprFromInput(g, nid, "in2");
            return new OrExpr(input_one, input_two);
        }
        case "compare": {
            const input_one = exprFromInput(g, nid, "in1");
            const input_two = exprFromInput(g, nid, "in2");
            return new CompareExpr(input_one, input_two, node.value);
        }
        case "dataref": {
            return new DatarefExpr(node.value);
        }
        case "Value Input": {
            return new ValueExpr(node.value);
        }
        default: {
            throw new Error(`Unknown node type: ${node.type}`);
        }
    }
}

// Build an ExpressionEmitter for an input port of a node
function exprFromInput(g: IRGraph, nodeId: NodeId, inputPort: string): ExpressionEmitter {
    // Example: assume the source node’s `value` already holds a Lua literal/expression
    const inputNodeId = inputSrcNode(g, nodeId, inputPort);
    return nodeToExprEmitter(g, inputNodeId);
}

export function lowerIRRegion(g: IRGraph, immediatePostDominators: Record<NodeId, NodeId | undefined>,
                             start?: NodeId, stop?: NodeId): StatementBlock
{
    const out: StatementEmitter[] = [];
    let curr: NodeId | undefined = start;

    while (curr && curr !== stop)
    {
        const node = g.nodes[curr];

        switch (node.type) {
            case "if-else": {
                const cond = exprFromInput(g, curr, "cond");
                const thenNode = outputNode(g, curr, THEN_PORT);
                const elseNode = outputNode(g, curr, ELSE_PORT);

                if (!thenNode) throw new Error("Missing then or else node");

                // find the merge point
                const merge = immediatePostDominators[curr];

                const thenBlock = lowerIRRegion(g, immediatePostDominators, thenNode, merge);
                const elseBlock = lowerIRRegion(g, immediatePostDominators, elseNode, merge);

                out.push(new IfStmt(cond, thenBlock, elseBlock));

                curr = merge;
                continue;
            }
            case "write-to-dataref": {
                const input = exprFromInput(g, curr, "data");
                out.push(new WriteToDataref(input, g.nodes[curr].value));
                const succs = getExecSuccessorIDs(g, curr);
                if (succs.length > 1) {
                    throw new Error("Write-to-dataref node has multiple successors");
                }
                curr = succs[0];
                continue;
            }
            default: {
                throw new Error("unhandled node type: " + node.type);
            }
        }
    }
    return new StatementBlock(out);
}


export function lowerIRtoAST(g: IRGraph): [StatementBlock, string]
{
    if (!g.start) throw new Error("IRGraph has no start node");
    let wheretowrite: string = "";
    if (g.nodes[g.start].type === "callback") {
        wheretowrite = g.nodes[g.start].value;
    }
    else if (g.nodes[g.start].type === "command") {
        wheretowrite = g.nodes[g.start].value;
    }
    const postDominators = computeImmediatePostDominators(g);
    const start = outputNode(g, g.start, "next");
    if (!start) throw new Error("Start node has no next node");
    const statementBlock = lowerIRRegion(g, postDominators, start);
    return [statementBlock, wheretowrite];
}