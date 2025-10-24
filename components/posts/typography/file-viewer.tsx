"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Copy, Check, FileCode, ExternalLink } from "lucide-react";
import Link from "next/link";

interface FileViewerProps {
  /** GitHub file URL (raw or blob) */
  url: string;
  /** Additional CSS classes for outer wrapper */
  className?: string;
}

export default function FileViewer({ url, className }: FileViewerProps) {
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [fileInfo, setFileInfo] = useState<{
    owner: string;
    repo: string;
    path: string;
    fileName: string;
    branch: string;
  } | null>(null);

  // Parse GitHub URL once
  useEffect(() => {
    try {
      let owner: string, repo: string, branch: string, path: string, fileName: string;
      if (url.includes("raw.githubusercontent.com")) {
        const parts = url.replace("https://raw.githubusercontent.com/", "").split("/");
        owner = parts[0];
        repo = parts[1];
        branch = parts[2];
        const pathParts = parts.slice(3);
        path = pathParts.join("/");
        fileName = path.split("/").pop() || "";
      } else {
        const parts = url.replace("https://github.com/", "").split("/");
        owner = parts[0];
        repo = parts[1];
        if (["blob", "tree", "raw"].includes(parts[2])) {
          branch = parts[3];
          const pathParts = parts.slice(4);
          path = pathParts.join("/");
        } else {
          branch = "main";
          const pathParts = parts.slice(2);
          path = pathParts.join("/");
        }
        fileName = path.split("/").pop() || "";
      }
      setFileInfo({ owner, repo, path, fileName, branch });
    } catch {
      setError("Failed to parse GitHub URL");
      setIsLoading(false);
    }
  }, [url]);

  // Fetch file content using secure API route
  useEffect(() => {
    if (!fileInfo) return;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `/api/github-file?url=${encodeURIComponent(url)}`;
        const res = await fetch(apiUrl);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch file content");
        setFileContent(json.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch file content");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fileInfo, url]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageClass = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'js': return 'language-javascript';
      case 'ts': return 'language-typescript';
      case 'tsx': return 'language-tsx';
      case 'jsx': return 'language-jsx';
      case 'html': return 'language-html';
      case 'css': return 'language-css';
      case 'json': return 'language-json';
      case 'md': return 'language-markdown';
      case 'py': return 'language-python';
      case 'go': return 'language-go';
      case 'java': return 'language-java';
      case 'rb': return 'language-ruby';
      case 'php': return 'language-php';
      case 'c': case 'cpp': case 'h': return 'language-c';
      case 'cs': return 'language-csharp';
      case 'sh': case 'bash': return 'language-bash';
      case 'yml': case 'yaml': return 'language-yaml';
      case 'sql': return 'language-sql';
      default: return 'language-plaintext';
    }
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700",
        "shadow-sm rounded-sm overflow-hidden",
        className
      )}
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      {fileInfo && (
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                {fileInfo.fileName}
              </h2>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors"
              aria-label="Copy file content"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        {isLoading ? (
          <div className="p-0 text-center text-neutral-600 dark:text-neutral-400">
            Loading file content...
          </div>
        ) : error ? (
          <div className="p-0 text-center text-red-600 dark:text-red-500">
            {error}
          </div>
        ) : (
          <pre
            className={cn(
              "px-4 overflow-x-auto overflow-y-auto text-sm text-neutral-800 dark:text-neutral-200",
              "bg-neutral-100 dark:bg-neutral-900",
              fileInfo && getLanguageClass(fileInfo.fileName)
            )}
            style={{
              fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              margin: 0,
              maxWidth: '100%',
              maxHeight: '500px',
              overflowX: 'auto',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              boxSizing: 'border-box',
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <code>{fileContent}</code>
          </pre>
        )}
      </div>

      {fileInfo && !isLoading && !error && (
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <Link
            href={`https://github.com/${fileInfo.owner}/${fileInfo.repo}/blob/${fileInfo.branch}/${fileInfo.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            View on GitHub <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
