import { createRoot } from "react-dom/client";
import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
    ConnectionPlugin,
    Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets, type ReactArea2D } from "rete-react-plugin";
import { getConnectionSockets } from "./utils";

// custom nodes
import {DatarefSelectControl} from "./controls/DatarefSelectControl.tsx";
import {DatarefSelectControlView} from "./renderer/DatarefSelectControlView.tsx";
import {ComparisonSelectControl} from "./controls/ComparisonSelectControl.tsx";
import {ComparisonSelectComponent} from "./renderer/ComparisonSelectComponent.tsx";

// Data
import type {ColoredSocket} from "./sockets/sockets.ts";
import {CallbackSelectControl} from "./controls/CallbackSelectControl.tsx";
import {CallbackSelectComponent} from "./renderer/CallbackSelectComponent.tsx";
import {ValueInputControl} from "./controls/ValueInputControl.tsx";
import {ValueInputComponent} from "./renderer/ValueInputComponent.tsx";
import {XluaMakerContextMenu} from "./contextMenu/ContextMenu.tsx";

// basic setup
import type {Schemes} from "./types.ts";
import {type ContextMenuExtra } from "rete-context-menu-plugin";
import {ArithmaticNode} from "./nodes/templates/arithmaticNode.tsx";
import {LogicNode} from "./nodes/templates/logicNode.tsx";
import {EventNode} from "./nodes/templates/eventNode.tsx";
type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra;

const ControlView: React.FC<{ data: ClassicPreset.Control }> = ({ data }) => {
    if (data instanceof DatarefSelectControl)
        return <DatarefSelectControlView data={data} />;
    if (data instanceof ComparisonSelectControl)
        return <ComparisonSelectComponent data={data} />;
    if (data instanceof CallbackSelectControl)
        return <CallbackSelectComponent data={data} />;
    if (data instanceof ValueInputControl)
        return <ValueInputComponent data={data} />;
    return null;
};

let _currentEditor: NodeEditor<Schemes> | null = null;
export const getCurrentEditor = () => _currentEditor;

export async function createEditor(container: HTMLElement) {
    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

    const contextMenu = new XluaMakerContextMenu<Schemes>();

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    // @ts-ignore
    render.addPreset(
        Presets.classic.setup({
            customize: {
                node(context) {
                    if (context.payload.label === "add" ||
                        context.payload.label === "subtract" ||
                        context.payload.label === "multiply" ||
                        context.payload.label === "divide" ||
                        context.payload.label === "Value Input" ||
                        context.payload.label === "dataref") {
                        return ArithmaticNode;
                    } else if (
                        context.payload.label === "and" ||
                        context.payload.label === "or" ||
                        context.payload.label === "not" ||
                        context.payload.label === "compare") {
                        return LogicNode;
                    } else if (
                        context.payload.label === "callback" ||
                        context.payload.label === "command" ||
                        context.payload.label === "if-else" ||
                        context.payload.label === "write-to-dataref"
                    ) {
                        return EventNode;
                    }
                    return Presets.classic.Node<Schemes>;
                },
                control() {
                    return ControlView;
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

    render.addPreset(Presets.contextMenu.setup());

    connection.addPreset(ConnectionPresets.classic.setup());

    editor.use(area);
    area.use(contextMenu)
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

    setTimeout(() => {
        // wait until nodes rendered because they dont have predefined width and height
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 10);

    _currentEditor = editor;

    return {
        destroy: () => area.destroy(),
    };
}