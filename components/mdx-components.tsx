import Dropcap from "@/components/dropcap";
import type { MDXComponents } from "mdx/types";

// Define any components that will be available to MDX content
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Use the provided components or empty object if not provided
    ...components,
    // Override specific components with custom implementations
    Dropcap,
  };
} 