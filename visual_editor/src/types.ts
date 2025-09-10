import { type GetSchemes } from "rete";
import { Connection } from "./connection";
import {
    CallbackNode,
} from "./nodes";

export type NodeProps =
    | CallbackNode;
export type ConnProps =
    | Connection<NodeProps, NodeProps>;

export type Schemes = GetSchemes<NodeProps, ConnProps>;