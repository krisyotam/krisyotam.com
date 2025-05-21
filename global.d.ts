// Type declarations for various file types
declare module '*.mdx' {
  import type { ReactNode } from 'react'
  const content: (props: { components?: Record<string, React.ComponentType> }) => ReactNode
  export default content
}

// Support for raw MDX imports
declare module '*.mdx?raw' {
  const content: string
  export default content
}

// Ensure JSON modules are properly typed
declare module '*.json' {
  const value: any
  export default value
} 