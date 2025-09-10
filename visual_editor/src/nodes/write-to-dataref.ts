import { ClassicPreset } from "rete";
import { execSocket, dataSocket } from "../sockets/sockets";

/**
 * Represents a node for writing to a data reference within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 *
 * This class is used to handle the flow of data writing operations through its assigned sockets.
 * It defines two input sockets:
 * 1. 'exec' - To handle execution signals.
 * 2. 'data' - To receive the data payload that needs to be written to the data reference.
 */
export class WriteToDatarefNode extends ClassicPreset.Node {
    constructor()
    {
        super("write-to-dataref");
        this.addInput('exec', new ClassicPreset.Input(execSocket));
        this.addInput('data', new ClassicPreset.Input(dataSocket));
    }
}