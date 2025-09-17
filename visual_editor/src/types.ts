import { type GetSchemes } from "rete";
import { Connection } from "./connection";
import {
    AddNode, AndNode,
    CallbackNode, CompareNode, DatarefNode, DivideNode, IfNode, MultiplyNode, NotNode, OrNode, SubtractNode,
    WriteToDatarefNode,
} from "./nodes";
import type {CommandNode} from "./nodes/command.ts";

export type NodeProps =
    AddNode
    | AndNode
    | CommandNode
    | CompareNode
    | DatarefNode
    | DivideNode
    | IfNode
    | MultiplyNode
    | NotNode
    | OrNode
    | SubtractNode
    | WriteToDatarefNode
    | CallbackNode;
export type ConnProps =
    | Connection<NodeProps, NodeProps>;

export type Schemes = GetSchemes<NodeProps, ConnProps>;