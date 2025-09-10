import { ClassicPreset} from "rete";
import { execSocket } from "../sockets/sockets";

/**
 * Represents a callback node in the ClassicPreset system.
 *
 * The CallbackNode class extends the ClassicPreset.Node class and represents
 * a specialized node type that contains a single output socket labeled 'out'.
 *
 * Use this class to process or define callback behavior within a node-based system.
 *
 * Inherits functionality from the parent ClassicPreset.Node class.
 */
export class CallbackNode extends ClassicPreset.Node
{
    constructor()
    {
        super("callback");
        this.addOutput('out', new ClassicPreset.Output(execSocket));
    }
}