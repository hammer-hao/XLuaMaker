import { ClassicPreset} from "rete";
import { dataSocket, booleanSocket } from "../sockets/sockets";

/**
 * The CompareNode class is used to create a node that compares two input values.
 * It is a subclass of the ClassicPreset.Node and is designed to handle logical comparisons.
 *
 * This node contains two input sockets (`in1` and `in2`) for data inputs and one output
 * socket (`out`) for returning the boolean result of the comparison.
 */
export class CompareNode extends ClassicPreset.Node {
    constructor() {
        super("compare");
        this.addInput('in1', new ClassicPreset.Input(dataSocket));
        this.addInput('in2', new ClassicPreset.Input(dataSocket));
        this.addOutput('out', new ClassicPreset.Output(booleanSocket));
    }
}