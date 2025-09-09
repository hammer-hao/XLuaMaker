// TypedHandle.tsx
import { Handle, type HandleType, Position } from '@xyflow/react';
import { TYPE_STYLE, type FlowType } from '../types/types';

type Props = {
    id: string;                 // e.g. "exec:out", "number:in"
    flowType: FlowType;
    type: HandleType;           // "source" | "target"
    position: Position;
    isConnectable?: boolean;
};

export function TypedHandle({ id, flowType, type, position, isConnectable }: Props) {
    const s = TYPE_STYLE[flowType];

    return (
        <div style={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)' }}>
            {/* Actual hitbox/connector */}
            <Handle
                id={id}
                type={type}
                position={position}
                isConnectable={isConnectable}
                className="rf-hitbox"
            >
                <span
                    className={`socket socket--${s.shape}`}
                    style={{
                        '--socket-color': s.color,
                        '--socket-glow': s.glow,
                    } as React.CSSProperties}
                    title={flowType}
                />
            </Handle>
        </div>
    );
}