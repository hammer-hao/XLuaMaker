import { ClassicPreset, NodeEditor } from "rete";
import { ColoredSocket } from "./sockets/sockets.ts";
import type {Schemes} from "./types";

type Sockets = ColoredSocket
type Input = ClassicPreset.Input<Sockets>
type Output = ClassicPreset.Output<Sockets>

export function getConnectionSockets(
    editor: NodeEditor<Schemes>,
    connection: Schemes['Connection']
)
{
    const source = editor.getNode(connection.source);
    const target = editor.getNode(connection.target);

    const output =
        source &&
        (source.outputs as Record<string, Input>)[connection.sourceOutput];
    const input =
        target &&
        (target.inputs as unknown as Record<string, Output>)[connection.targetInput];

    return {
        source: output?.socket,
        target: input?.socket
    };
}