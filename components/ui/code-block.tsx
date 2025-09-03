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
            .filter((child: any) => typeof child === 'string')
            .join('');
          
          if (stringParts) {
            return stringParts;
          }
          
          // Look for nested structure
          for (const child of childProps.children) {
            if (React.isValidElement(child) && child.props && 
                typeof (child.props as { children?: string }).children === 'string') {
              return (child.props as { children: string }).children;
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
    <div className="code-block p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] font-mono text-sm relative" style={{marginBottom: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, marginTop: 0, paddingTop: 0}}>
      {/* Header with tabs or filename */}
      <div className="flex flex-col gap-2">
        {/* Header bar with subtle color separation */}
        <div className="relative w-full h-7 mb-4" style={{marginTop: 0}}>
          <div className="absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.04)] border-b border-border rounded-none z-0" />
          {/* Filename at top left */}
          {(!tabsExist && filename) && (
            <div className="absolute text-xs text-muted-foreground h-7 flex items-center z-10" style={{whiteSpace: 'nowrap', marginTop: 0, left: 0, top: 0, position: 'absolute'}}>{filename}</div>
          )}
          {/* Copy button at very top right */}
          <button
            onClick={copyToClipboard}
            className="absolute right-0 top-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-sans px-2 py-1 rounded z-10"
            style={{marginRight: '0.5rem', marginTop: '0.25rem'}}
          >
            {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
          </button>
          {/* Tabs (if present) below filename */}
          {tabsExist && (
            <div className="flex items-center gap-2 min-w-0 absolute left-0 top-0 h-7 pl-2 z-10">
              {tabs.map((tab, index) => (
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code Content with always-visible, square-cornered scrollbars */}
      <div
        className="code-container max-h-[500px] w-full"
        style={{
          overflow: 'scroll',
          padding: 0,
          margin: 0,
          boxSizing: 'border-box',
          height: '100%',
        }}
      >
        <SyntaxHighlighter
          language={activeLanguage}
          style={theme === 'dark' ? atomDark : prism}
          customStyle={{
            margin: 0,
            padding: 0,
            background: "transparent",
            fontSize: "0.875rem",
            width: "100%",
            overflow: "visible",
            paddingLeft: 0,
            paddingRight: 0,
          }}
          codeTagProps={{
            style: {
              display: 'block',
              width: '100%',
              paddingLeft: 0,
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
              paddingLeft: 0,
              paddingRight: 0,
              margin: 0,
            },
            className: "syntax-line"
          })}
          PreTag="div"
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
        {/* Custom scrollbar for square corners (Webkit) */}
        <style>{`
          .code-container::-webkit-scrollbar {
            border-radius: 0 !important;
            background: #181c20 !important;
            height: 28px !important;
            width: 28px !important;
            margin: 0 !important;
          }
          .code-container::-webkit-scrollbar-thumb {
            border-radius: 0 !important;
            background: #444 !important;
            min-height: 28px !important;
            min-width: 28px !important;
            height: 36px !important;
            width: 36px !important;
          }
          .code-container {
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            /* Remove border-radius if present */
            border-radius: 0 !important;
          }
          .code-container > * {
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
          }
        `}</style>
      </div>
    </div>
  );
};
