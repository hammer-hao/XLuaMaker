// controls/DatarefSelectControl.tsx
import { ClassicPreset } from "rete";
import type {Dataref} from "../types/types.ts";

export class DatarefSelectControl extends ClassicPreset.Control {
    public value: string;
    public options: Dataref[];
    public writableOnly: boolean;
    public onChange?: (val: string) => void; // optional callback

    constructor(
        value: string,
        options: Dataref[],
        onChange?: (val: string) => void,
        writableOnly = false
    ) {
        super();
        this.value = value;
        this.options = options;
        this.onChange = onChange;
        this.writableOnly = writableOnly
    }
}