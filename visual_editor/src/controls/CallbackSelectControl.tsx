// controls/DatarefSelectControl.tsx
import { ClassicPreset } from "rete";
import { CALLBACK_META } from "../types/types.ts";

export class CallbackSelectControl extends ClassicPreset.Control {
    public value: string;
    public options = CALLBACK_META;
    public onChange?: (val: string) => void; // optional callback

    constructor(
        value: string,
        onChange?: (val: string) => void
    ) {
        super();
        this.value = value;
        this.onChange = onChange;
    }
}