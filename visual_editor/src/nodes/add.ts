import { ClassicPreset} from "rete";
import { dataSocket } from "../sockets/sockets";

/**
 * Represents a node for performing addition operations within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class AddNode extends ClassicPreset.Node {
    constructor()
    {
        super("add");
        this.addInput('in1', new ClassicPreset.Input(dataSocket, "value"));
        this.addInput('in2', new ClassicPreset.Input(dataSocket, "value"));
        this.addOutput('out', new ClassicPreset.Output(dataSocket, "sum"));
    }
}