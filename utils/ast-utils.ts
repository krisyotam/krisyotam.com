import * as escodegen from "escodegen"
import * as acorn from "acorn"

export function generateCode(ast: any): string {
  return escodegen.generate(ast)
}

export function parseCode(code: string): any {
  return acorn.parse(code, { ecmaVersion: 2020 })
}

