'use client'

import { MDXProvider } from '@mdx-js/react'
import { ReactNode } from 'react'

const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold mb-2" {...props} />,
  p: (props: any) => <p className="mb-4" {...props} />,
  a: (props: any) => <a className="text-blue-600 hover:underline" {...props} />,
  ul: (props: any) => <ul className="list-disc ml-6 mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal ml-6 mb-4" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-100 rounded p-4 overflow-x-auto" {...props} />
  ),
}

export function MDXProviderWrapper({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
} 