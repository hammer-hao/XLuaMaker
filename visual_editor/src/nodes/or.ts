import { ClassicPreset} from "rete";
import { booleanSocket } from "../sockets/sockets";

/**
 * Represents a node for performing addition operations within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class OrNode extends ClassicPreset.Node {
    constructor()
    {
        super("or");
        this.addInput('in1', new ClassicPreset.Input(booleanSocket));
        this.addInput('in2', new ClassicPreset.Input(booleanSocket));
        this.addOutput('out', new ClassicPreset.Output(booleanSocket));
    }
}