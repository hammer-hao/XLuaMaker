import { useCallback, useMemo, useRef } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import Select, {components, type MenuListProps} from 'react-select';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Dataref } from '../types/types';

type ExistingDatarefNodeData = {
    value: string;                   // selected dataref name
    datarefs: Dataref[];             // all options
    onChange?: (value: string) => void;
    isConnectable?: boolean;
};

type Option = { value: string; label: string };

function VirtualizedMenuList<Option, IsMulti extends boolean>(
    props: MenuListProps<Option, IsMulti>
) {
    const { children, maxHeight = 240} = props;
    // children is an array of <Option/> elements from react-select
    const items = Array.isArray(children) ? children : [children];

    const parentRef = useRef<HTMLDivElement | null>(null);
    const rowHeight = 34;

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => rowHeight,
        overscan: 6,
    });

    const totalHeight = virtualizer.getTotalSize();
    const virtualItems = virtualizer.getVirtualItems();

    return (
        <components.MenuList {...props}>
            <div
                ref={parentRef}
                style={{ maxHeight, overflow: 'auto', position: 'relative' }}
            >
                <div style={{ height: totalHeight, position: 'relative' }}>
                    {virtualItems.map(v => (
                        <div
                            key={v.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                transform: `translateY(${v.start}px)`,
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

function ExistingDatarefNode({ id, data, isConnectable }: NodeProps<ExistingDatarefNodeData>) {
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
        },
        [id, setNodes]
    );

    // Find the selected dataref by name (unchanged)
    const selected = useMemo(
        () => data.datarefs.find(d => d.name === data.value),
        [data.datarefs, data.value]
    );

    return (
        <div
            className="existing-dataref-node"
            style={{
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: 10,
                background: '#ffffff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                maxWidth: 420
            }}
        >
            <div style={{ minWidth: 280 }}>
                <label htmlFor={`dataref-${id}`} style={{ display: 'block', marginBottom: 4 }}>
                    Dataref:
                </label>
                <Select
                    inputId={`dataref-${id}`}
                    instanceId={`dataref-${id}`}     // avoids SSR/id warnings
                    className="nodrag"               // lets you interact without dragging the node
                    options={options}
                    value={selectedOption}
                    onChange={handleChange}
                    isClearable
                    placeholder="Select a dataref"
                    menuPortalTarget={document.body} // optional: keeps menu above the canvas
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    components={{ MenuList: VirtualizedMenuList }}
                    maxMenuHeight={240}
                />
            </div>

            {/* Details panel (unchanged) */}
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
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
        </div>
    );
}

export default ExistingDatarefNode;
