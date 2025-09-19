import { ClassicPreset} from "rete";
import { booleanSocket } from "../sockets/sockets";

/**
 * Represents a node for performing addition operations within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class AndNode extends ClassicPreset.Node {
    constructor()
    {
        super("and");
        this.addInput('in1', new ClassicPreset.Input(booleanSocket, "boolean"));
        this.addInput('in2', new ClassicPreset.Input(booleanSocket, "boolean"));
        this.addOutput('out', new ClassicPreset.Output(booleanSocket, "and"));
    }
}