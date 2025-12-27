import fs from 'fs'
import path from 'path'

// Simple utility to walk a directory recursively and collect files
async function walk(dir: string, exts: string[] = []): Promise<string[]> {
  const results: string[] = []
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      results.push(...(await walk(full, exts)))
    } else if (e.isFile()) {
      if (exts.length === 0 || exts.includes(path.extname(full))) {
        results.push(full)
      }
    }
  }
  return results
}

function tryResolveImport(fromFile: string, importPath: string): string | null {
  // handle absolute-ish paths or aliases conservatively by ignoring them
  if (!importPath.startsWith('.')) return null
  const base = path.resolve(path.dirname(fromFile), importPath)
  const candidates = [
    base,
    base + '.tsx',
    base + '.ts',
    base + '.jsx',
    base + '.js',
    path.join(base, 'index.tsx'),
    path.join(base, 'index.ts'),
    path.join(base, 'index.jsx'),
    path.join(base, 'index.js'),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  return null
}

async function main() {
  const repoRoot = process.cwd()
  const componentsDir = path.join(repoRoot, 'components')
  const appDir = path.join(repoRoot, 'app')
  const outFile = path.join(repoRoot, 'cleanup', 'components.txt')

  if (!fs.existsSync(componentsDir)) {
    console.error('components/ directory not found at', componentsDir)
    process.exit(2)
  }

  const compFiles = await walk(componentsDir, ['.tsx', '.ts', '.jsx', '.js'])

  type CompInfo = {
    file: string
    name: string
    deps: Set<string>
    appearsIn: Set<string>
    used: boolean
  }

  const compsByFile = new Map<string, CompInfo>()
  const compsByName = new Map<string, CompInfo>()

  for (const f of compFiles) {
    const name = path.basename(f, path.extname(f))
    const info: CompInfo = { file: f, name, deps: new Set(), appearsIn: new Set(), used: false }
    compsByFile.set(f, info)
    // if duplicate names exist, prefer first but still keep mapping: store with path suffix
    if (!compsByName.has(name)) compsByName.set(name, info)
  }

  // Build dependency graph: parse import statements inside components and resolve to other components
  const importRegex = /import\s+(?:.+?)\s+from\s+['"](.+?)['"]/g

  for (const [file, info] of compsByFile) {
    const src = await fs.promises.readFile(file, 'utf8')
    let m: RegExpExecArray | null
    importRegex.lastIndex = 0
    while ((m = importRegex.exec(src))) {
      const importPath = m[1]
      const resolved = tryResolveImport(file, importPath)
      if (resolved && resolved.startsWith(componentsDir)) {
        if (compsByFile.has(resolved)) info.deps.add(resolved)
      }
    }
  }

  // Scan app/ files for direct usage (imports or JSX tags)
  const appFiles = fs.existsSync(appDir) ? await walk(appDir, ['.tsx', '.ts', '.jsx', '.js', '.mdx']) : []

  // Helper to mark appearance
  function markAppearance(comp: CompInfo, filePath: string) {
    comp.appearsIn.add(filePath)
  }

  // Precompute all repo files to list where the component name appears
  const repoFiles = await walk(repoRoot)

  for (const [file, info] of compsByFile) {
    // find occurrences of the name across the repo (quick textual search)
    const occurrences: string[] = []
    for (const rf of repoFiles) {
      try {
        const content = await fs.promises.readFile(rf, 'utf8')
        if (content.includes(info.name)) occurrences.push(rf)
      } catch (e) {
        // ignore binary or unreadable
      }
    }
    for (const o of occurrences) info.appearsIn.add(o)
  }

  // Detect direct usage: app files importing a component file or using JSX tag
  const importFromRegex = /from\s+['"](.+?)['"]/g
  for (const af of appFiles) {
    const content = await fs.promises.readFile(af, 'utf8')
    // imports
    importFromRegex.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = importFromRegex.exec(content))) {
      const importPath = m[1]
      const resolved = tryResolveImport(af, importPath)
      if (resolved && compsByFile.has(resolved)) {
        const comp = compsByFile.get(resolved)!
        markAppearance(comp, af)
        comp.used = true
      }
    }

    // JSX usage: look for <ComponentName or {ComponentName
    for (const [file, info] of compsByFile) {
      const jsxRegex = new RegExp('<' + info.name + '\\b')
      const curlyRegex = new RegExp('\\b' + info.name + '\\b')
      if (jsxRegex.test(content) || curlyRegex.test(content)) {
        markAppearance(info, af)
        info.used = true
      }
    }
  }

  // Propagate usage through dependency graph (if A used and A imports B, then B used)
  const stack: string[] = []
  for (const [file, info] of compsByFile) if (info.used) stack.push(file)
  while (stack.length) {
    const f = stack.pop()!
    const info = compsByFile.get(f)!
    for (const dep of info.deps) {
      const dInfo = compsByFile.get(dep)!
      if (!dInfo.used) {
        dInfo.used = true
        stack.push(dep)
      }
    }
  }

  // Build output file content
  const lines: string[] = []
  lines.push('# Component usage report')
  lines.push('# Generated by trace.ts')
  lines.push('')

  const unused: string[] = []

  const sorted = Array.from(compsByFile.values()).sort((a, b) => a.name.localeCompare(b.name))
  for (const comp of sorted) {
    lines.push('## ' + comp.name + (comp.used ? ' (USED)' : ' (UNUSED)'))
    lines.push('Source: ' + path.relative(repoRoot, comp.file))
    lines.push('Appears in:')
    const appears = Array.from(comp.appearsIn).sort()
    for (const p of appears) lines.push('- ' + path.relative(repoRoot, p))
    lines.push('')
    if (!comp.used) unused.push(path.relative(repoRoot, comp.file))
  }

  lines.push('')
  lines.push('---')
  lines.push('Summary:')
  lines.push('Total components scanned: ' + sorted.length)
  lines.push('Unused components: ' + unused.length)
  for (const u of unused) lines.push('- ' + u)

  await fs.promises.mkdir(path.dirname(outFile), { recursive: true })
  await fs.promises.writeFile(outFile, lines.join('\n'), 'utf8')

  console.log('Wrote component usage report to', outFile)
  console.log('Total components:', sorted.length, 'Unused:', unused.length)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
