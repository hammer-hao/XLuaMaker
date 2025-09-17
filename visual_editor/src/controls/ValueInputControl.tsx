import { ClassicPreset } from "rete";

export class ValueInputControl extends ClassicPreset.Control {
    value: string;
    onChange?: (val: string) => void;
    constructor() {
        super();
        this.value = "";
    }
}