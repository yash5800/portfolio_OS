import React, { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Icon } from "../libs/icons";
import { copyText } from "../libs/clipboard";

// Register only what the data files use, keeping the lazy chunk small.
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);

const CodeBlock = ({ code, language = "javascript", compact = false }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const ok = await copyText(code);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#0b0e16]">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/40 px-1.5 py-1 text-[10px] text-white/45 opacity-0 backdrop-blur transition hover:text-white/80 group-hover:opacity-100"
      >
        <Icon name={copied ? "check" : "copy"} size={11} />
        {copied ? "Copied" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: compact ? "10px 12px" : "14px 16px",
          background: "transparent",
          fontSize: "11.5px",
          lineHeight: 1.65,
        }}
        codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
