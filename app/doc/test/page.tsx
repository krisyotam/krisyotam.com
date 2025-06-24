"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
}

function toErrorWithMessage(maybeError: unknown): { message: string } {
  if (isErrorWithMessage(maybeError)) return maybeError
  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    return new Error(String(maybeError))
  }
}

export default function DocTestPage() {
  const [references, setReferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any | null>(null)
  const [testId, setTestId] = useState("")
  const [testFilename, setTestFilename] = useState("")

  // Load references data
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        setLoading(true)
        const response = await fetch('/doc/debug')
        
        if (!response.ok) {
          throw new Error(`Debug route returned ${response.status}`)
        }
        
        const debugData = await response.json()
        setDebugInfo(debugData)
        
        if (debugData.file?.exists) {
          const dataStr = debugData.file.sampleContent
          try {
            // Try to parse the first part of the JSON to extract some references
            const startBracket = dataStr.indexOf('[')
            const modifiedJson = dataStr.substring(startBracket) + '...]'
            const data = JSON.parse(modifiedJson)
            setReferences(Array.isArray(data) ? data : [])
          } catch (parseError: unknown) {
            const errorWithMessage = toErrorWithMessage(parseError)
            setError(`Failed to parse references JSON: ${errorWithMessage.message}`)
          }
        } else {
          setError(`references.json does not exist: ${debugData.file?.path}`)
        }
      } catch (err: unknown) {
        const errorWithMessage = toErrorWithMessage(err)
        setError(`Failed to load references: ${errorWithMessage.message}`)
      } finally {
        setLoading(false)
      }
    }
    
    fetchReferences()
  }, [])

  // Generate test URLs
  const generateTestLinks = () => {
    if (!references || references.length === 0) return null
    
    return (
      <div className="mt-4 space-y-4">
        <h2 className="text-xl font-bold">Test Links</h2>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Enter reference ID to test" 
              value={testId} 
              onChange={(e) => setTestId(e.target.value)}
            />
            <Button asChild className="whitespace-nowrap">
              <Link href={`/doc/${testId}`} target="_blank">Test ID</Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Enter filename to test (e.g., sample.pdf)" 
              value={testFilename}
              onChange={(e) => setTestFilename(e.target.value)}
            />
            <Button asChild className="whitespace-nowrap">
              <Link href={`/doc/${testFilename}`} target="_blank">Test Filename</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {references.map((ref, index) => {
            // Extract filename from URL
            const urlParts = ref.url?.split('/') || []
            const filename = urlParts[urlParts.length - 1] || ''
            
            return (
              <div key={index} className="p-4 border rounded-md">
                <p><strong>ID:</strong> {ref.id}</p>
                <p><strong>Title:</strong> {ref.title}</p>
                <p><strong>URL:</strong> {ref.url}</p>
                <p><strong>Filename:</strong> {filename}</p>
                <div className="flex gap-2 mt-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/doc/${ref.id}`} target="_blank">
                      Test ID Route
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/doc/${filename}`} target="_blank">
                      Test Filename Route
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={ref.url} target="_blank">
                      Direct URL
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Debug information display
  const renderDebugInfo = () => {
    if (!debugInfo) return null
    
    return (
      <div className="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
        <h2 className="text-xl font-bold mb-4">Debug Information</h2>
        <pre className="whitespace-pre-wrap overflow-auto max-h-[500px] text-xs">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Document Route Tester</h1>
      
      {loading && <p>Loading references data...</p>}
      
      {error && (
        <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md text-red-800 dark:text-red-200 mb-4">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {generateTestLinks()}
      {renderDebugInfo()}
    </div>
  )
} 