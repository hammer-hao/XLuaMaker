import type {Dataref} from "../types/types";

export function parseDatarefTsv(data: string) : Dataref[]
{
    const datarefs: Dataref[] = [];
    const lines = data
        .split("\n")
        .map(l => l.trim())
        .filter(line => line.length > 0);

    if (lines.length == 0) { return [] }

    const rows = lines.slice(2); // skip header

    for (const row of rows) {
        const parts = row.split("\t");
        if (parts.length > 5 || parts.length < 3) {
            continue; // skip invalid rows
        }
        const [name, type, writable, units, desc] = parts;
        datarefs.push({
            name: name,
            type: type,
            writable: writable == "y",
            units: units,
            description: desc,
        });
    }
    return datarefs;
}