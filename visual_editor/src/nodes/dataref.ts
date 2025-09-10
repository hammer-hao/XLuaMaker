import { ClassicPreset} from "rete";
import {dataSocket } from "../sockets/sockets";
import type {Dataref} from "../types/types.ts";

/**
 * Represents a node for reading data from a data reference within a node-based system.
 * Inherits functionality from the `ClassicPreset.Node` base class.
 */
export class DatarefNode extends ClassicPreset.Node {
    // hold optional datarefs + current value
    data: {
        datarefs: Dataref[];
        value?: string;
    }
    constructor(datarefs: Dataref[])
    {
        super("dataref");
        this.addOutput('out', new ClassicPreset.Output(dataSocket));
        this.data = {
            datarefs: datarefs,
            value: "",
        }
    }
}