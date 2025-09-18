import {StatementBlock} from "../XLuaEmitter/emitters.ts";

export interface Context {
    register_dataref(name: string): string;
    register_command(name: string): string;
    push(block: StatementBlock, wheretowrite: string): void;
    compile(): string;
}

export interface writable {
    write(statement: string): void;
    emit(): string;
}

type Dataref = {
    xplane_name: string;
    lua_name: string;
}

type Command = {
    xplane_name: string;
    handler_name: string;
    lines: string[];
}

class func_write_context implements writable {
    name: string;
    lines: string[] = [];
    constructor(name: string) {
        this.name = name;
        this.lines = [];
    }
    write(statement: string): void {
        this.lines.push(statement);
    }
    emit(): string {
        return `function ${this.name}()\n` + this.lines.join("\n") + "\nend";
    }
}

class command_write_context implements writable {
    name: string;
    lines: string[] = [];
    constructor(name: string) {
        this.name = name;
        this.lines = [];
    }
    write(statement: string): void {
        this.lines.push(statement);
    }
    emit(): string {
        return `function ${this.name}(phase, duration)\n` + this.lines.join("\n") + "\nend";
    }
}

class main_write_context implements writable {
    lines: string[] = [];
    constructor() {
        this.lines = [];
    }
    write(statement: string): void {
        this.lines.push(statement);
    }
    emit(): string {
        return this.lines.join("\n");
    }
}

export class XLuaContext implements Context{
    public datarefs: Record<string, Dataref> = {};
    public cutom_datarefs: Record<string, Dataref> = {};
    public commands: Record<string, Command> = {};
    public available_writables: Record<string, writable> = {
        "main": new main_write_context(),
        "aircraft_load": new func_write_context("aircraft_load"),
        "aircraft_unload": new func_write_context("aircraft_unload"),
        "flight_start": new func_write_context("flight_start"),
        "flight_crash": new func_write_context("flight_crash"),
        "before_physics": new func_write_context("before_physics"),
        "after_physics": new func_write_context("after_physics"),
        "after_replay": new func_write_context("after_replay"),
    };
    public current_writable: writable;
    constructor() {
        this.current_writable = this.available_writables["main"];
    }

    push(block: StatementBlock, wheretowrite: string): void {
        if (wheretowrite in this.available_writables) {
            this.switch_context(wheretowrite);
        }
        else {
            const new_context = this.register_command(wheretowrite)
            this.switch_context(new_context);
        }
        this.current_writable.write(block.emit(this));
    }

    switch_context(context: string) {
        this.current_writable = this.available_writables[context];
    }

    register_command(name: string): string {
        const command = {
            xplane_name: name,
            handler_name: `${name}_handler`,
            lines: []
        }
        this.commands[command.handler_name] = command;
        this.available_writables[command.handler_name] = new command_write_context(command.handler_name);
        return command.handler_name;
    }

    register_dataref(name: string): string {
        if (name in this.datarefs) {
            return this.datarefs[name].lua_name;
        }
        if (name in this.cutom_datarefs) {
            return this.cutom_datarefs[name].lua_name;
        }
        let last = name.split("/").pop() ?? name;
        last = last.replace(/[\[\]]/g, "");
        const dataref = {
            xplane_name: name,
            lua_name: last.replace(/[^a-zA-Z0-9_]/g, "_")
        };

        this.datarefs[name] = dataref;
        return dataref.lua_name;
    }

    compile(): string {
        var result: string = "";
        for (const dataref of Object.values(this.datarefs)) {
            result += `${dataref.lua_name} = find_dataref("${dataref.xplane_name}")\n`;
        }
        for (const [handlername, command] of Object.entries(this.commands)) {
            result += `register_command("${command.xplane_name}", "placeholder", ${handlername})\n`;
        }
        for (const writable of Object.values(this.available_writables)) {
            result += writable.emit() + "\n";
        }
        return result;
    }
}