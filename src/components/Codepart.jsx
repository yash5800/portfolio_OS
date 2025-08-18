import React from 'react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Codepart = ({ code }) => {
  return (
    <div className="rounded-xl flex justify-center items-center w-full">
      <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="rounded-md shadow-xl shadow-slate-900 w-full">
        {code}
      </SyntaxHighlighter>
    </div>

  )
}

export default Codepart