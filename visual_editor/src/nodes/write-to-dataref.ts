import { ClassicPreset } from "rete";
import { execSocket, dataSocket } from "../sockets/sockets";
import {DatarefSelectControl} from "../controls/DatarefSelectControl.tsx";
import {writableDatarefs} from "../data/datarefs.ts";

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
        this.addInput('prev', new ClassicPreset.Input(execSocket, "exec"));
        this.addInput('data', new ClassicPreset.Input(dataSocket, "value"));
        this.addOutput('next', new ClassicPreset.Output(execSocket, "next"));
        this.addControl("dataref", new DatarefSelectControl("", writableDatarefs));
    }
}