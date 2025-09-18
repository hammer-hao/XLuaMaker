// controls/DatarefSelectControl.tsx
import { ClassicPreset } from "rete";

export class ComparisonSelectControl extends ClassicPreset.Control {
    public value: string;
    public options: string[] = [">", "<", "==", ">=", "<=", "!="];
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