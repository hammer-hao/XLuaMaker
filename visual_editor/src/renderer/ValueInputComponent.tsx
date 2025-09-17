import type { ValueInputControl } from "../controls/ValueInputControl";
import { useEffect, useState } from "react";
import { Drag } from "rete-react-plugin";

export function ValueInputComponent(props: { data: ValueInputControl }) {
    const { data } = props;
    const [value, setValue] = useState<string>(data.value ?? "");

    useEffect(() => {
        setValue(data.value ?? "");
    }, [data.value]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setValue(next);
        data.value = next;
        data.onChange?.(next); // optional callback hook
    };

    return (
        <Drag.NoDrag>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="enter text"
                style={{
                    width: "100%",
                    padding: "4px 6px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "0.9rem"
                }}
            />
        </Drag.NoDrag>
    );
}