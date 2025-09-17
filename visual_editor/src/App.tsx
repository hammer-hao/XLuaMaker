import {createEditor, getCurrentEditor} from "./editor.tsx";
import { useRete } from "rete-react-plugin";
import {buildIR} from "./codegen/IR/IR.tsx";

export default function App() {
    const [ref] = useRete(createEditor);

    const handleCreateIR = () => {
        const editor = getCurrentEditor();
        if (!editor) return;
        const ir = buildIR(editor);   // pass editor in
        console.log("IR:", ir)
    };

    return (
        <div className="App" style={{ height: "100vh", width: "100vw", position: "relative" }}>
            <div ref={ref} style={{ height: "100%", width: "100%" }} />

            {/* floating debug button */}
            <button
                onClick={handleCreateIR}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    padding: "6px 12px",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                Create IR
            </button>
        </div>
    );
}