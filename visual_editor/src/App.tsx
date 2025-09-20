import { createEditor, getCurrentEditor } from "./editor.tsx";
import { useRete } from "rete-react-plugin";
import { buildIR } from "./codegen/IR/IR.tsx";

export default function App() {
    const [ref] = useRete(createEditor);

    const handleCreateIR = () => {
        const editor = getCurrentEditor();
        if (!editor) return;

        try {
            const outFile = buildIR(editor);

            const blob = new Blob([outFile], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (err) {
            console.error("Error while building IR:", err);
            alert("⚠️ Failed to generate IR: " + (err instanceof Error ? err.message : String(err)));
        }
    };

    return (
        <div
            className="App"
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* Top bar */}
            <div
                style={{
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                    background: "#2e2f36",
                    borderBottom: "1px solid #1a1c22",
                    color: "#fff",
                    fontFamily: "sans-serif",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                }}
            >
                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        letterSpacing: "0.5px"
                    }}
                >
                    XLuaMaker <span style={{ fontWeight: "normal", fontSize: "16px" }}>by hammer-hao</span>
                </div>
                <button
                    onClick={handleCreateIR}
                    style={{
                        padding: "8px 16px",
                        background: "#444",
                        color: "#fff",
                        border: "1px solid #666",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    Generate .lua file
                </button>
            </div>

            {/* Editor canvas below */}
            <div ref={ref} style={{ flex: 1, width: "100%" }} />
        </div>
    );
}