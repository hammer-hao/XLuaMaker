import { ClassicPreset} from "rete";
import { execSocket, booleanSocket } from "../sockets/sockets";

/**
 * Represents a node for performing conditional execution within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class IfNode extends ClassicPreset.Node {
    constructor() {
        super("if-else");
        this.addInput('prev', new ClassicPreset.Input(execSocket, "exec"));
        this.addInput('cond', new ClassicPreset.Input(booleanSocket, "condition"));
        this.addOutput('then', new ClassicPreset.Output(execSocket, "true"));
        this.addOutput('else', new ClassicPreset.Output(execSocket, "false"));
    }
}