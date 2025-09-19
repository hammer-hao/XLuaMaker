import { Presets } from "rete-react-plugin";
import { css } from "styled-components";

/** UE5-ish node styles */
const ueBlueprintNode = css<{ selected?: boolean }>`
    /* Card */
    width: auto;
    height: auto;
    background: linear-gradient(180deg, #2e2f36 0%, #23252b 100%);
    border: 1px solid #1a1c22;
    border-radius: 12px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
    overflow: hidden;

    /* Thin outer rim for that “panel” feel */
    outline: 1px solid rgba(255, 255, 255, 0.05);
    outline-offset: -1px;

    /* Title bar: bright blueprint header */

    .title {
        background: linear-gradient(180deg, #ff3a3a 0%, #a21212 100%);
        color: #e9f1ff;
        font-weight: 700;
        letter-spacing: 0.3px;
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
        padding: 8px 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.35);
    }

    /* Content area spacing */

    .controls,

        /* Inputs left / Outputs right spacing like BP */
    .input-socket {
        margin-left: 5px;
    }

    .output-socket {
        margin-right: 5px;
    }

    /* Subtle hover lift */
    transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.07);
    }

    /* Selected glow (BP-ish cyan rim) */
    ${(p) =>
            p.selected &&
            css`
        border-color: #e15aff;
        box-shadow: 0 0 0 1px rgba(105, 33, 154, 0.8),
        0 0 18px rgba(89, 43, 136, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    `}
`;

export function EventNode(props: any) {
    return <Presets.classic.Node styles={() => ueBlueprintNode} {...props} />;
}
