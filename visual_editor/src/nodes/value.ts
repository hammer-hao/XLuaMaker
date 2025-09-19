import { ClassicPreset} from "rete";
import { dataSocket } from "../sockets/sockets";
import {ValueInputControl} from "../controls/ValueInputControl.tsx";

/**
 * Represents a node for performing subtraction operations within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class ValueNode extends ClassicPreset.Node {
    constructor()
    {
        super("Value Input");
        this.addOutput('out', new ClassicPreset.Output(dataSocket, "value"));
        this.addControl("value_input", new ValueInputControl());
    }
}