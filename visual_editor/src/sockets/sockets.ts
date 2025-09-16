import {ClassicPreset} from "rete";

export class ColoredSocket extends ClassicPreset.Socket {
    color: string;

    constructor(name: string, color: string) {
        super(name);
        this.color = color;
    }

    isCompatibleWith(socket: ClassicPreset.Socket) {
        return socket.name === this.name;
    }
}

// Instances
export const execSocket = new ColoredSocket("exec", "#ff4d4f");    // red
export const dataSocket = new ColoredSocket("data", "#40a9ff");    // blue
export const booleanSocket = new ColoredSocket("boolean", "#52c41a"); // green