import { ClassicPreset } from "rete";
import {dataSocket, execSocket} from "../sockets/sockets";
import {ValueInputControl} from "../controls/ValueInputControl.tsx";

/**
 * Represents a node for executing a command within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class CommandNode extends ClassicPreset.Node {
    constructor()
    {
        super("command");
        this.addOutput('next', new ClassicPreset.Input(execSocket, "next"));
        this.addOutput('phase', new ClassicPreset.Output(dataSocket, "phase"));
        this.addOutput('duration', new ClassicPreset.Output(dataSocket, "duration"));
        this.addControl("command_input", new ValueInputControl())
    }
}