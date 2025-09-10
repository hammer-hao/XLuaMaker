import { ClassicPreset} from "rete";
import { dataSocket } from "../sockets/sockets";

/**
 * Represents a node for performing multiplication operations within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class MultiplyNode extends ClassicPreset.Node {
    constructor()
    {
        super("multiply");
        this.addInput('in1', new ClassicPreset.Input(dataSocket));
        this.addInput('in2', new ClassicPreset.Input(dataSocket));
        this.addOutput('out', new ClassicPreset.Output(dataSocket));
    }
}