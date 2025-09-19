import { ClassicPreset} from "rete";
import { dataSocket } from "../sockets/sockets";

/**
 * Represents a node for performing division operations within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class DivideNode extends ClassicPreset.Node {
    constructor()
    {
        super("divide");
        this.addInput('in1', new ClassicPreset.Input(dataSocket, "dividend"));
        this.addInput('in2', new ClassicPreset.Input(dataSocket, "divisor"));
        this.addOutput('out', new ClassicPreset.Output(dataSocket, "quotient"));
    }
}