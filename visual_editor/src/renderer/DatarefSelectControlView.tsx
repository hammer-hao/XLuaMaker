import { useCallback, useMemo } from "react";
import Select from "react-select";
import { ClassicPreset } from "rete";
import { DatarefNode } from "../nodes";

type Props = { control: ClassicPreset.Control; node: DatarefNode };

export function DatarefSelectControlView({control, node}: Props)
{
    const options = useMemo(
        () => node.data.datarefs.map((d) => ({ value: d.name, label: d.name })),
        [node.data.datarefs]
    );

    const selected = useMemo(
        () => options.find((o) => o.value === (node.data.value ?? "")) ?? null,
        [options, node.data.value]
    );

    const onChange = useCallback((opt: { value: string; label: string } | null) =>
        {
            node.data.value = opt?.value ?? "";
        },
        [node]
    );

    return (
        <div onPointerDown={(e) => e.stopPropagation()}>
            <Select
                options={options}
                value={selected}
                onChange={onChange as any}
                isClearable
                placeholder="Select a dataref"
            />
        </div>
    )
}