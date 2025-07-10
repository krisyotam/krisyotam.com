"use client";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { prism } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { ReactNode } from "react";

// Base props that apply to both variants
interface BaseCodeBlockProps {
  language: string;
  filename?: string;
  highlightLines?: number[];
}

// Props for basic CodeBlock with code or children
interface SimpleCodeBlockProps extends BaseCodeBlockProps {
  code?: string;
  children?: ReactNode;
  tabs?: never;
}

// Props for CodeBlock with tabs
interface TabsCodeBlockProps extends BaseCodeBlockProps {
  tabs: Array<{
    name: string;
    code: string;
    language?: string;
    highlightLines?: number[];
  }>;
  code?: never;
  children?: never;
}

type CodeBlockProps = SimpleCodeBlockProps | TabsCodeBlockProps;

export const CodeBlock = ({
  language,
  filename,
  code,
  highlightLines = [],
  tabs = [],
  children,
}: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const { theme } = useTheme();

  // Extract code from children if provided
  const extractCodeFromChildren = (): string => {
    if (!children) return '';
    
    // If children is a string, use it directly
    if (typeof children === 'string') {
      return children;
    }
    
    // Handle code as a template literal in braces (common in MDX)
    if (React.isValidElement(children)) {
      const childProps = children.props;
      
      // Handle the {`...code...`} pattern (most common in MDX)
      if (childProps) {
        // Direct string child
        if (typeof childProps.children === 'string') {
          return childProps.children;
        }
        
        // Handle array of children where one might be our code
        if (Array.isArray(childProps.children)) {
          // Combine all string children
          const stringParts = childProps.children
            .filter(child => typeof child === 'string')
            .join('');
          
          if (stringParts) {
            return stringParts;
          }
          
          // Look for nested structure
          for (const child of childProps.children) {
            if (React.isValidElement(child) && typeof child.props?.children === 'string') {
              return child.props.children;
            }
          }
        }
      }
      
      // Handle native markdown code blocks from MDX processing
      if (childProps?.className?.startsWith('language-')) {
        return typeof childProps.children === 'string' 
          ? childProps.children 
          : '';
      }
    }
    
    // If we get here and children isn't obvious code, try JSON stringify with fallback
    try {
      // Last resort - try to stringify 
      const stringified = JSON.stringify(children);
      if (stringified !== '{}' && stringified !== '[]') {
        return String(children);
      }
    } catch (e) {
      // Ignore error and use empty string
    }
    
    return '';
  };

  const tabsExist = tabs && tabs.length > 0;
  const codeFromChildren = extractCodeFromChildren();
  const codeContent = tabsExist ? undefined : (code || codeFromChildren);

  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : codeContent;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCode = tabsExist ? tabs[activeTab].code : codeContent;
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;
  const activeHighlightLines = tabsExist
    ? tabs[activeTab].highlightLines || []
    : highlightLines;

  return (
    <div className="code-block p-6 rounded-none my-6 bg-muted/50 dark:bg-[hsl(var(--popover))] font-mono text-sm relative">
      {/* Header with tabs or filename */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center py-2">
          <div className="flex overflow-x-auto">
            {tabsExist ? 
              tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-3 !py-2 text-xs transition-colors font-sans ${
                    activeTab === index
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.name}
                </button>
              ))
              : (filename && <div className="text-xs text-muted-foreground">{filename}</div>)
            }
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
          >
            {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
          </button>
        </div>
      </div>

      {/* Code Content with scrollbar after 20 lines */}
      <div className="code-container max-h-[500px] overflow-y-auto w-full overflow-x-auto">
        <SyntaxHighlighter
          language={activeLanguage}
          style={theme === 'dark' ? atomDark : prism}
          customStyle={{
            margin: 0,
            padding: 0,
            background: "transparent",
            fontSize: "0.875rem", // text-sm equivalent
            width: "100%",
            overflowX: "visible",
          }}
          codeTagProps={{
            style: {
              display: 'block',
              width: '100%',
              paddingLeft: '0',
            }
          }}
          wrapLines={true}
          showLineNumbers={true}
          lineProps={(lineNumber: number) => ({
            style: {
              backgroundColor: activeHighlightLines.includes(lineNumber)
                ? theme === 'dark' 
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)"
                : "transparent",
              display: "flex",
              width: "100%",
              minWidth: "100%",
              whiteSpace: "pre",
              paddingLeft: "0",
              paddingRight: "0",
              margin: "0",
            },
            className: "syntax-line"
          })}
          PreTag="div"
          codeTagProps={{
            style: {
              whiteSpace: "pre",
            },
          }}
          className="react-syntax-highlighter-line-number"
          lineNumberContainerStyle={{
            float: 'left',
            minWidth: '3em',
            maxWidth: '3em',
            position: 'sticky', 
            left: 0,
            background: 'inherit',
          }}
          lineNumberStyle={{
            minWidth: "3em",
            maxWidth: "3em", 
            paddingRight: "1em", 
            textAlign: "right",
            userSelect: "none",
            borderRight: "1px solid " + (theme === 'dark' ? "rgba(127, 127, 127, 0.2)" : "rgba(127, 127, 127, 0.2)"),
            marginRight: "1em",
            color: "rgba(127, 127, 127, 0.6)",
            fontSize: "0.8em",
            fontFamily: "monospace",
            display: "inline-block",
            position: "sticky",
            left: 0,
            background: 'inherit',
          }}
        >
          {String(activeCode || '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
