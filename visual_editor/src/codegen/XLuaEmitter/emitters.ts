import type {Context} from "../context/XLuaContext.ts";

export interface emitter {
    emit(): string;
}

export interface StatementEmitter extends emitter
{
    write(context: Context): void;
}

export class StatementBlock implements StatementEmitter {
    body: StatementEmitter[];
    constructor(body: StatementEmitter[]) {
        this.body = body;
    }
    emit(): string {
        for (const statement of this.body) {
            statement.emit();
        }
        return "";
    }
    write(context: Context): void {
        for (const statement of this.body) {
            statement.write(context);
        }
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
    emit(): string {
        return `(${this.in1.emit()} + ${this.in2.emit()})`;
    }
}

export class SubtractExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(): string {
        return `(${this.in1.emit()} - ${this.in2.emit()})`;
    }
}

export class MultiplyExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(): string {
        return `(${this.in1.emit()} * ${this.in2.emit()})`;
    }
}

export class DivideExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(): string {
        return `(${this.in1.emit()} / ${this.in2.emit()})`;
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
    emit(): string {
        return `(${this.in1.emit()} ${this.operator} ${this.in2.emit()})`;
    }
}

export class AndExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(): string {
        return `(${this.in1.emit()} and ${this.in2.emit()})`;
    }
}

export class OrExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    readonly in2: ExpressionEmitter;
    constructor(in1: ExpressionEmitter, in2: ExpressionEmitter) {
        this.in1 = in1;
        this.in2 = in2;
    }
    emit(): string {
        return `(${this.in1.emit()} or ${this.in2.emit()})`;
    }
}

export class NotExpr implements ExpressionEmitter {
    readonly in1: ExpressionEmitter;
    constructor(in1: ExpressionEmitter) {
        this.in1 = in1;
    }
    emit(): string {
        return `!${this.in1.emit()}`;
    }
}

export class DatarefExpr implements ExpressionEmitter {
    readonly alias: string;
    constructor(alias: string) {
        this.alias = alias;
    }
    emit(): string {
        return this.alias;
    }
}

export class ValueExpr implements ExpressionEmitter {
    readonly value: string;
    constructor(value: string) {
        this.value = value;
    }
    emit(): string {
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
    emit(): string {
        return `${this.target} = ${this.in1.emit()} `;
    }
    write(context: Context) {
        context.push(`${this.target} = ${this.in1.emit()}`);
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
    emit(): string {
        return `if ${this.condition.emit()} then ${this.thenBlock.emit()} else ${this.elseBlock.emit()} end`;
    }

    write(context: Context) {
        context.push(`if ${this.condition.emit()} then`);
        this.thenBlock.write(context);
        if (this.elseBlock)
        {
            context.push(`else`);
            this.elseBlock.write(context);
        }
        context.push(`end`);
    }
}
