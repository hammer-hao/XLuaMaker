import type {Context} from "../context/XLuaContext.ts";

export interface emitter {
    emit(context: Context): string;
}

export interface StatementEmitter extends emitter
{
}

export class StatementBlock implements StatementEmitter {
    body: StatementEmitter[];
    constructor(body: StatementEmitter[]) {
        this.body = body;
    }
    emit(context: Context): string {
        var out = ""
        for (const statement of this.body) {
            out += statement.emit(context) + "\n";
        }
        return out;
    }
}

export interface ExpressionEmitter extends emitter {

}

export class AddExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(context: Context): string {
        return `(${this.in1.emit(context)} + ${this.in2.emit(context)})`;
    }
}

export class SubtractExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(context: Context): string {
        return `(${this.in1.emit(context)} - ${this.in2.emit(context)})`;
    }
}

export class MultiplyExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(context: Context): string {
        return `(${this.in1.emit(context)} * ${this.in2.emit(context)})`;
    }
}

export class DivideExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(context: Context): string {
        return `(${this.in1.emit(context)} / ${this.in2.emit(context)})`;
    }
}

export class CompareExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    readonly operator: string;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter, operator: string) {
        this.in1 = in1;
        this.in2 = in2;
        this.operator = operator;
    }
    emit(context: Context): string {
        return `(${this.in1.emit(context)} ${this.operator} ${this.in2.emit(context)})`;
    }
}

export class AndExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(context: Context): string {
        return `(${this.in1.emit(context)} and ${this.in2.emit(context)})`;
    }
}

export class OrExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(context: Context): string {
        return `(${this.in1.emit(context)} or ${this.in2.emit(context)})`;
    }
}

export class NotExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    constructor(in1: ExpressionEmitter) {
        this.in1 = in1;
    }
    emit(context: Context): string {
        return `!${this.in1.emit(context)}`;
    }
}

export class DatarefExpr implements ExpressionEmitter {
    readonly alias: string;
    constructor(alias: string) {
        this.alias = alias;
    }
    emit(context: Context): string {
        return context.register_dataref(this.alias);
    }
}

export class ValueExpr implements ExpressionEmitter {
    readonly value: string;
    constructor(value: string) {
        this.value = value;
    }
    emit(_context: Context): string {
        return this.value;
    }
}

export class WriteToDataref implements StatementEmitter {
    readonly in1: ExpressionEmitter;
    readonly target: string;
    constructor(in1: ExpressionEmitter, target: string) {
        this.in1 = in1;
        this.target = target;
    }
    emit(context: Context): string {
        return `${context.register_dataref(this.target)} = ${this.in1.emit(context)} `;
    }
}

export class CommandExpr implements ExpressionEmitter {
    constructor() {
    }
    emit(_context: Context): string {
        return "phase";
    }
}

export class IfStmt implements StatementEmitter {
    readonly condition: ExpressionEmitter;
    readonly thenBlock: StatementBlock;
    readonly elseBlock: StatementBlock;
    constructor(condition: ExpressionEmitter, thenBlock: StatementBlock, elseBlock: StatementBlock) {
        this.condition = condition;
        this.thenBlock = thenBlock;
        this.elseBlock = elseBlock;
    }
    emit(context: Context): string {
        return `if ${this.condition.emit(context)} then\n${this.thenBlock.emit(context)}\nelse\n${this.elseBlock.emit(context)}\nend\n`;
    }
}
