import Select from "react-select";
import type {DatarefSelectControl} from "../controls/DatarefSelectControl.tsx";

export function DatarefSelectControlView(props: { data: DatarefSelectControl })
{
    const options = props.data.options.map((d) => ({ value: d.name, label: d.name }));

    const selected =
        options.find((o) => o.value === (props.data.value ?? "")) ?? null;

    const onChange = (opt: { value: string; label: string } | null) => {
        const next = opt?.value ?? "";
        props.data.value = next;
        props.data.onChange?.(next); // optional callback hook
    };

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