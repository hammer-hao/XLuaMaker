import { useCallback, useMemo } from 'react';
import { Position, type NodeProps, useReactFlow } from '@xyflow/react';
import Select from 'react-select';
import type { Dataref } from '../types/types';
import { TypedHandle } from '../handles/TypedHandle';

// Reuse your ExistingDatarefNodeData shape so it can be constructed the same way.
type WriteDatarefNodeData = {
    value: string;
    datarefs: Dataref[];
    onChange?: (value: string) => void;
    isConnectable?: boolean;
};

type Option = { value: string; label: string };

// If you already have VirtualizedMenuList exported elsewhere, import and use that instead.
import { components, type MenuListProps } from 'react-select';
import { useVirtualizer } from '@tanstack/react-virtual';
function VirtualizedMenuList<Option, IsMulti extends boolean>(
    props: MenuListProps<Option, IsMulti>
) {
    const { children, maxHeight = 240 } = props;
    const items = Array.isArray(children) ? children : [children];
    const parentRef = (globalThis as any).React?.useRef<HTMLDivElement | null>(null) ?? null;

    // Fallback if not using React.useRef above; replace with your own ref if needed.
    // @ts-ignore
    const ref = parentRef || { current: null };

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => ref.current,
        estimateSize: () => 34,
        overscan: 6
    });

    const totalHeight = virtualizer.getTotalSize();
    const virtualItems = virtualizer.getVirtualItems();

    return (
        <components.MenuList {...props}>
            <div ref={ref as any} style={{ maxHeight, overflow: 'auto', position: 'relative' }}>
                <div style={{ height: totalHeight, position: 'relative' }}>
                    {virtualItems.map(v => (
                        <div
                            key={v.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                transform: `translateY(${v.start}px)`
                            }}
                        >
                            {items[v.index]}
                        </div>
                    ))}
                </div>
            </div>
        </components.MenuList>
    );
}

export default function WriteDatarefNode({
                                             id,
                                             data,
                                             isConnectable
                                         }: NodeProps<WriteDatarefNodeData>) {
    const { setNodes } = useReactFlow();

    const options = useMemo<Option[]>(
        () => data.datarefs.map(d => ({ value: d.name, label: d.name })),
        [data.datarefs]
    );

    const selectedOption = useMemo<Option | null>(
        () => options.find(o => o.value === (data.value ?? '')) ?? null,
        [options, data.value]
    );

    const handleChange = useCallback(
        (opt: Option | null) => {
            const next = opt?.value ?? '';
            setNodes(nodes =>
                nodes.map(node =>
                    node.id === id ? { ...node, data: { ...node.data, value: next } } : node
                )
            );
            data.onChange?.(next);
        },
        [id, setNodes, data]
    );

    const selected = useMemo(
        () => data.datarefs.find(d => d.name === data.value),
        [data.datarefs, data.value]
    );

    return (
        <div
            className="write-dataref-node"
            style={{
                position: 'relative',          // enable absolute positioning for handles/labels
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: 10,
                background: '#ffffff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                maxWidth: 420
            }}
        >
            {/* Left-side INPUT (target) handles */}
            <TypedHandle
                id="exec:in"
                flowType="exec"
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                style={{ top: 18 }}
            />
            <div
                style={{
                    position: 'absolute',
                    left: -6,
                    top: 4,
                    transform: 'translateX(-100%)',
                    fontSize: 10,
                    color: '#475569',
                    userSelect: 'none'
                }}
            >
                exec
            </div>

            <TypedHandle
                id="data:in"
                flowType="int"
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                style={{ top: 54 }}
            />
            <div
                style={{
                    position: 'absolute',
                    left: -6,
                    top: 40,
                    transform: 'translateX(-100%)',
                    fontSize: 10,
                    color: '#475569',
                    userSelect: 'none'
                }}
            >
                int
            </div>

            {/* Body */}
            <div style={{ minWidth: 280 }}>
                <label htmlFor={`wdataref-${id}`} style={{ display: 'block', marginBottom: 4 }}>
                    Dataref (write target):
                </label>
                <Select
                    inputId={`wdataref-${id}`}
                    instanceId={`wdataref-${id}`}
                    className="nodrag"
                    options={options}
                    value={selectedOption}
                    onChange={handleChange}
                    isClearable
                    placeholder="Select a dataref to write"
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    components={{ MenuList: VirtualizedMenuList }}
                    maxMenuHeight={240}
                />
            </div>

            {selected && (
                <div
                    style={{
                        marginTop: 8,
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        padding: 8,
                        background: '#f8fafc'
                    }}
                >
                    <div style={{ fontFamily: 'monospace', fontSize: 12 }}>{selected.name}</div>
                    <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span
                style={{
                    fontSize: 11,
                    padding: '2px 6px',
                    borderRadius: 999,
                    background: '#eef2ff',
                    border: '1px solid #c7d2fe'
                }}
                title="Type"
            >
              type: {selected.type}
            </span>
                        <span
                            style={{
                                fontSize: 11,
                                padding: '2px 6px',
                                borderRadius: 999,
                                background: selected.writable ? '#ecfeff' : '#f1f5f9',
                                border: '1px solid #bae6fd'
                            }}
                            title="Writable"
                        >
              {selected.writable ? 'writable' : 'read-only'}
            </span>
                        {selected.units && (
                            <span
                                style={{
                                    fontSize: 11,
                                    padding: '2px 6px',
                                    borderRadius: 999,
                                    background: '#f0fdf4',
                                    border: '1px solid #bbf7d0'
                                }}
                                title="Units"
                            >
                units: {selected.units}
              </span>
                        )}
                    </div>
                    {selected.description && (
                        <div style={{ marginTop: 6, fontSize: 12, color: '#334155' }}>
                            {selected.description}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
