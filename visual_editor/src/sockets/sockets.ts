import {ClassicPreset} from "rete";

export class ExecSocket extends ClassicPreset.Socket
{
    constructor() { super("exec"); }
    isCompatibleWith(socket: ClassicPreset.Socket) { return socket instanceof ExecSocket; }
}

export class DataSocket extends ClassicPreset.Socket
{
    constructor() { super("data"); }
    isCompatibleWith(socket: ClassicPreset.Socket) { return socket instanceof DataSocket; }
}

export class BooleanSocket extends ClassicPreset.Socket
{
    constructor() { super("boolean"); }
    isCompatibleWith(socket: ClassicPreset.Socket) { return socket instanceof BooleanSocket; }
}

export const execSocket = new ExecSocket();
export const dataSocket = new DataSocket();
export const booleanSocket = new BooleanSocket();