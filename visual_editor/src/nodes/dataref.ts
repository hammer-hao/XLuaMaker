import { ClassicPreset} from "rete";
import {dataSocket } from "../sockets/sockets";
import {DatarefSelectControl} from "../controls/DatarefSelectControl.tsx";
import {datarefs} from "../data/datarefs.ts";

/**
 * Represents a node for reading data from a data reference within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class DatarefNode extends ClassicPreset.Node {
    // hold optional datarefs + current value
    constructor()
    {
        super("dataref");
        this.addOutput('out', new ClassicPreset.Output(dataSocket));
        this.addControl("dataref", new DatarefSelectControl("", datarefs));
    }
}