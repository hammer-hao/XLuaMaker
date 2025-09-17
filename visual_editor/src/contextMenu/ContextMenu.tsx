import {
    ContextMenuPlugin,
    Presets as ContextMenuPresets,
} from "rete-context-menu-plugin";

import type {Schemes} from "../types.ts";
import {
    AddNode, AndNode,
    CallbackNode,
    CompareNode,
    DatarefNode, DivideNode,
    IfNode,
    MultiplyNode, NotNode, OrNode,
    SubtractNode,
    WriteToDatarefNode
} from "../nodes";
import {CommandNode} from "../nodes/command.ts";
import {ValueNode} from "../nodes/value.ts";

export class XluaMakerContextMenu<S extends Schemes> extends ContextMenuPlugin<S> {
    constructor() {
        super({
            items: ContextMenuPresets.classic.setup([
                ["Add Node", [
                    ["Math", [
                        ["Add", () => new AddNode()],
                        ["Subtract", () => new SubtractNode()],
                        ["Multiply", () => new MultiplyNode()],
                        ["Divide", () => new DivideNode()],
                    ]],
                    ["Logic", [
                        ["Compare", () => new CompareNode()],
                        ["And", () => new AndNode()],
                        ["Or", () => new OrNode()],
                        ["Not", () => new NotNode()],
                        ["If-else", () => new IfNode()],
                    ]],
                    ["Events", [
                        ["Command", () => new CommandNode()],
                        ["Callback", () => new CallbackNode()],
                    ]],
                    ["Data", [
                        ["Dataref", () => new DatarefNode()],
                        ["Write Dataref", () => new WriteToDatarefNode()],
                        ["Value Input", () => new ValueNode()],
                    ]]
                ]],
            ],)
        });
    }
}