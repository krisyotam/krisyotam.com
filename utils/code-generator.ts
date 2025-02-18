import * as escodegen from "escodegen"

export function generateCode(ast: any): string {
  return escodegen.generate(ast)
}

// Add a test to ensure escodegen is working
const testAst = {
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "Literal",
        value: "Hello, World!",
        raw: "'Hello, World!'",
      },
    },
  ],
}

console.log("Test output:", generateCode(testAst))

