import { ClassicPreset } from "rete";
import { execSocket } from "../sockets/sockets";

/**
 * Represents a node for executing a command within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class CommandNode extends ClassicPreset.Node {
    constructor()
    {
        super("command");
        this.addOutput('exec', new ClassicPreset.Input(execSocket));
    }
}