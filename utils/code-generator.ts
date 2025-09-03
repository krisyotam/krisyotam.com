import { generateCode } from "./ast-utils"

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

