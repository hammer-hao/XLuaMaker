import { createRoot } from "react-dom/client";
import { NodeEditor, type GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
    ConnectionPlugin,
    Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets, type ReactArea2D } from "rete-react-plugin";
import { getConnectionSockets } from "./utils";

// custom nodes
import {
    CallbackNode,
    WriteToDatarefNode,
    DatarefNode,
    AddNode,
    SubtractNode,
    MultiplyNode,
    CompareNode,
    IfNode
} from "./nodes"
import {DatarefSelectControl} from "./controls/DatarefSelectControl.tsx";
import {DatarefSelectControlView} from "./renderer/DatarefSelectControlView.tsx";
import {ComparisonSelectControl} from "./controls/ComparisonSelectControl.tsx";
import {ComparisonSelectComponent} from "./renderer/ComparisonSelectComponent.tsx";

// Data
import type {ColoredSocket} from "./sockets/sockets.ts";
import {CallbackSelectControl} from "./controls/CallbackSelectControl.tsx";
import {CallbackSelectComponent} from "./renderer/CallbackSelectComponent.tsx";

// basic setup
type Schemes = GetSchemes<
    ClassicPreset.Node,
    ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = ReactArea2D<Schemes>;

export async function createEditor(container: HTMLElement) {
    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    // @ts-ignore
    render.addPreset(
        Presets.classic.setup({
            customize: {
                control(data) {
                    console.log('rendering dataref select');
                    console.log(data.payload);
                    if (data.payload instanceof DatarefSelectControl) {
                        return DatarefSelectControlView;
                    }
                    if (data.payload instanceof ComparisonSelectControl) {
                        return ComparisonSelectComponent;
                    }
                    if (data.payload instanceof CallbackSelectControl) {
                        return CallbackSelectComponent;
                    }
                    return null;
                },
                socket() {
                    // Must return a component that accepts { data: Socket }
                    return (props: { data: ClassicPreset.Socket }) => {
                        console.log('rendering socket');
                        const s = props.data as Partial<ColoredSocket>;
                        const color = s?.color ?? "#888";

                        return (
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    background: color,
                                    boxShadow: `0 0 0 2px ${color}22`,
                                    flex: "0 0 auto",
                                }}
                            />
                        );
                    };
                },
            }
        })
    );

    connection.addPreset(ConnectionPresets.classic.setup());

    editor.use(area);
    area.use(connection);
    area.use(render);

    AreaExtensions.simpleNodesOrder(area);

    editor.addPipe((context) => {
        if (context.type === "connectioncreate") {
            const { data } = context;
            const { source, target } = getConnectionSockets(editor, data);

            if (source && target && !source.isCompatibleWith(target)) {
                console.log("Sockets are not compatible", "error");
                return;
            }
        }
        return context;
    });

    const c = new CallbackNode();
    const w = new WriteToDatarefNode();
    const d = new DatarefNode();
    const comp = new CompareNode()
    const a = new AddNode();
    const s = new SubtractNode();
    const m = new MultiplyNode();
    const c2 = new CompareNode();
    const i = new IfNode();

    await editor.addNode(c);
    await editor.addNode(w);
    await editor.addNode(d);
    await editor.addNode(a);
    await editor.addNode(s);
    await editor.addNode(m);
    await editor.addNode(c2);
    await editor.addNode(i);
    await editor.addNode(comp);

    setTimeout(() => {
        // wait until nodes rendered because they dont have predefined width and height
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 10);
    return {
        destroy: () => area.destroy(),
    };
}