import { ClassicPreset } from "rete";
import { execSocket } from "../sockets/sockets";
import {ValueInputControl} from "../controls/ValueInputControl.tsx";

/**
 * Represents a node for executing a command within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class CommandNode extends ClassicPreset.Node {
    constructor()
    {
        super("command");
        this.addOutput('next', new ClassicPreset.Input(execSocket));
        this.addControl("command_input", new ValueInputControl())
    }
}