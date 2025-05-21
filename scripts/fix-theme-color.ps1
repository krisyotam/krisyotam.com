# PowerShell script to fix themeColor configuration
# Moves themeColor from metadata to viewport export

$warnings = Get-Content -Path "theme_warnings.txt" -ErrorAction SilentlyContinue

# Extract unique page paths 
$affectedPaths = $warnings | Select-String 'metadata export in (/[^.]+)' -AllMatches | 
                  ForEach-Object { $_.Matches.Groups[1].Value } | 
                  Sort-Object -Unique

if (!$affectedPaths -or $affectedPaths.Count -eq 0) {
    Write-Host "No affected paths found in theme_warnings.txt. Please ensure this file exists with themeColor warnings."
    exit
}

Write-Host "Found $($affectedPaths.Count) unique paths with themeColor warnings"

# Convert URL paths to file paths
$modifiedFiles = 0
$skippedFiles = 0
$errorFiles = 0
$fileList = @()

foreach ($path in $affectedPaths) {
    # Convert URL path to file path (handle special cases)
    $filePath = if ($path -eq "/_not-found") {
        "app/not-found.tsx"
    } else {
        "app$($path)/page.tsx"
    }

    $fileList += $filePath
    
    Write-Host "Processing file: $filePath"
    
    if (!(Test-Path $filePath)) {
        # Try MDX variant if TSX doesn't exist
        $filePath = $filePath -replace "\.tsx$", ".mdx"
        
        if (!(Test-Path $filePath)) {
            Write-Host "  Error: File not found: $filePath" -ForegroundColor Red
            $errorFiles++
            continue
        }
    }
    
    try {
        $content = Get-Content -Path $filePath -Raw
        
        # Check if file has metadata with themeColor
        if ($content -match "export\s+const\s+metadata\s*=\s*\{[^}]*themeColor[^}]*\}") {
            Write-Host "  Found themeColor in metadata"
            
            # Extract themeColor value
            $themeColorMatch = [regex]::Match($content, "themeColor:\s*['""](#[0-9a-fA-F]+)['""]")
            if ($themeColorMatch.Success) {
                $themeColorValue = $themeColorMatch.Groups[1].Value
                Write-Host "  Extracted themeColor value: $themeColorValue"
                
                # Remove themeColor from metadata
                $content = $content -replace "(themeColor:\s*['""](#[0-9a-fA-F]+)['""],?\s*)", ""
                
                # Check if viewport export already exists
                if ($content -match "export\s+const\s+viewport") {
                    Write-Host "  Viewport export already exists - updating"
                    # Update existing viewport
                    $content = $content -replace "(export\s+const\s+viewport\s*=\s*\{[^}]*)\}", "`$1, themeColor: '$themeColorValue'}"
                } else {
                    # Add viewport export
                    Write-Host "  Adding new viewport export"
                    $importViewport = if ($content -match "import.+?Metadata") {
                        $content = $content -replace "import(.+?)Metadata", "import`$1Metadata, Viewport"
                        ""
                    } else {
                        "import { Viewport } from 'next'\n"
                    }
                    
                    # Add viewport export after metadata export
                    $content = $content -replace "(export\s+const\s+metadata.+?\}\s*)", "`$1\n$importViewport\nexport const viewport = {\n  themeColor: '$themeColorValue'\n}\n"
                }
                
                # Write the modified content back to the file
                Set-Content -Path $filePath -Value $content
                Write-Host "  Updated $filePath" -ForegroundColor Green
                $modifiedFiles++
            } else {
                Write-Host "  Could not extract themeColor value - skipping" -ForegroundColor Yellow
                $skippedFiles++
            }
        } else {
            Write-Host "  No themeColor found in metadata - skipping" -ForegroundColor Yellow
            $skippedFiles++
        }
    } catch {
        $errorMessage = $_.Exception.Message
        Write-Host "  Error processing file $filePath" -ForegroundColor Red
        Write-Host "  Error message: $errorMessage" -ForegroundColor Red
        $errorFiles++
    }
}

Write-Host "`nSummary:"
Write-Host "Files modified: $modifiedFiles"
Write-Host "Files skipped: $skippedFiles"
Write-Host "Files with errors: $errorFiles"
Write-Host "Total files processed: $($fileList.Count)"
Write-Host "`nList of files that were processed:"
foreach ($file in $fileList) {
    Write-Host " - $file"
} 