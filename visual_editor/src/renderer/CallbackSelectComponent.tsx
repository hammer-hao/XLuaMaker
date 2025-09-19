import type {CallbackSelectControl} from "../controls/CallbackSelectControl";
import {useEffect, useMemo, useState} from "react";
import {Drag} from "rete-react-plugin";
import Select from "react-select";

type Opt = { value: string, label: string}

export function CallbackSelectComponent(props: { data: CallbackSelectControl}) {
    const { data } = props;

    const [value, setValue] = useState<string>(data.value ?? "");

    // Map whatever we get into proper react-select options
    const options: Opt[] = useMemo(() => {
        const src = data.options ?? [];
        return Object.keys(src).map((k) => ({ value: k, label: k }));
    }, [data.options]);

    // Compute the selected option object from the string value
    const selected = useMemo<Opt | null>(
        () => options.find((o) => o.value === value) ?? null,
        [options, value]
    );

    useEffect(() => {
        setValue(data.value ?? "");
    }, [data.value]);

    const onChange = (opt: Opt | null) => {
        const next = opt?.value ?? "";
        setValue(next);
        data.value = next;
        data.onChange?.(next); // optional callback hook
    };

    return (
        <Drag.NoDrag>
            <Select
                value={selected}
                options={options}
                onChange={onChange as any}
                menuPortalTarget={document.body}
                placeholder="select a callback"
                // Optional QoL:
                isClearable
                isSearchable={false}
                menuPlacement="auto"
            />
        </Drag.NoDrag>
    );
}