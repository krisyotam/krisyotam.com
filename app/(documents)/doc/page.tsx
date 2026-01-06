/**
 * ============================================================================
 * Doc Page
 * Author: Kris Yotam
 * Date: 2026-01-04
 * Filename: page.tsx
 * Description: Document archives page displaying files stored in the doc
 *              bucket. Protected by password authentication.
 * ============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ArchivesComponent from "@/components/archive";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface StorageData {
  buckets: {
    name: string;
    objects: {
      bucket: string;
      key: string;
      size: number;
      last_modified: string;
      original_url: string;
      public_url: string;
    }[];
  }[];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DocPage() {
  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [storageData, setStorageData] = useState<StorageData | null>(null);

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("archives-authenticated");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
      fetchStorageData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Data Fetching
  // -------------------------------------------------------------------------

  const fetchStorageData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/storage?bucket=doc");
      if (!response.ok) {
        throw new Error("Failed to fetch storage data");
      }
      const data = await response.json();
      setStorageData(data);
    } catch (error) {
      console.error("Error fetching storage data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------------

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const response = await fetch("/api/verify-archives-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("archives-authenticated", "true");
        fetchStorageData();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePasswordSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  // -------------------------------------------------------------------------
  // Loading State
  // -------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Authentication Gate
  // -------------------------------------------------------------------------

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
        <div className="w-full max-w-md p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-sm">
          <div className="flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h1 className="text-xl font-serif text-center mb-6 dark:text-gray-100">
            Archives Access
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            This page is password protected. Please enter the password to access
            the archives.
          </p>

          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-none border-gray-300 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300"
                  autoFocus
                />
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="rounded-none bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full rounded-none bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 text-white"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Access Archives"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Main Content
  // -------------------------------------------------------------------------

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title="Doc"
          subtitle="Collection of Documents"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split("T")[0]}
          status="Finished"
          confidence="certain"
          importance={7}
          preview="a comprehensive list of the archived content available at krisyotam.com"
        />

        {storageData && (
          <ArchivesComponent defaultBucket="doc" data={storageData} />
        )}

        <PageDescription
          title="About Documents"
          description="The documents page is designed to provide a index of all the files I have archived to combat link rot for the content nececssary to understand my work. This includes PDFs, presentations, and other relevant materials that supplement my essays and projects."
        />
      </div>
    </div>
  );
}
