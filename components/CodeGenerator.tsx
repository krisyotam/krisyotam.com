"use client"

import { useState } from "react"
import { generateCode, parseCode } from "../utils/ast-utils"

export function CodeGenerator() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const handleGenerate = () => {
    try {
      const ast = parseCode(input)
      const generatedCode = generateCode(ast)
      setOutput(generatedCode)
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    }
  }

  return (
    <div className="p-4">
      <textarea
        className="w-full p-2 border rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter code here"
      />
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleGenerate}>
        Generate
      </button>
      <pre className="mt-4 p-2 bg-gray-100 rounded">{output}</pre>
    </div>
  )
}

