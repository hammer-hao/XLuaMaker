import { ClassicPreset} from "rete";
import { execSocket, booleanSocket } from "../sockets/sockets";

/**
 * Represents a node for performing conditional execution within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class IfNode extends ClassicPreset.Node {
    constructor() {
        super("if");
        this.addInput('in1', new ClassicPreset.Input(booleanSocket));
        this.addOutput('out', new ClassicPreset.Output(execSocket));
        this.addOutput('out2', new ClassicPreset.Output(execSocket));
    }
}