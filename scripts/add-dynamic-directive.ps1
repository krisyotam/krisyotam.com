# PowerShell script to add 'dynamic = force-dynamic' directive to API routes
# This script finds all route.ts files in app/api directory that use searchParams
# and adds the dynamic directive if it's not already there

$apiDir = Join-Path $PSScriptRoot "..\app\api" -Resolve
$routeFiles = Get-ChildItem -Path $apiDir -Filter "route.ts" -Recurse

$modifiedCount = 0
$alreadyModifiedCount = 0
$skippedCount = 0

foreach ($file in $routeFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if the file uses searchParams or request.url
    $usesSearchParams = $content -match "searchParams|request\.url"
    
    # Skip if the file doesn't use searchParams
    if (-not $usesSearchParams) {
        Write-Host "Skipping $($file.FullName) - doesn't use searchParams"
        $skippedCount++
        continue
    }
    
    # Skip if the file already has the dynamic directive
    if ($content -match "export\s+const\s+dynamic\s*=\s*['`"]force-dynamic['`"]") {
        Write-Host "Skipping $($file.FullName) - already has dynamic directive"
        $alreadyModifiedCount++
        continue
    }
    
    # Add the dynamic directive after the imports
    $importSection = [regex]::Match($content, "^(import.*?)\r?\n\r?\n", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    if ($importSection.Success) {
        $newContent = $content.Substring(0, $importSection.Length) + 
                      "`nexport const dynamic = 'force-dynamic';`n" + 
                      $content.Substring($importSection.Length)
                      
        # Write the modified content back to the file
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Added dynamic directive to $($file.FullName)"
        $modifiedCount++
    } else {
        Write-Host "Couldn't find import section in $($file.FullName) - manual fix needed"
    }
}

Write-Host "`nSummary:"
Write-Host "Files modified: $modifiedCount"
Write-Host "Files already had directive: $alreadyModifiedCount"
Write-Host "Files skipped (no searchParams): $skippedCount"
Write-Host "Total files processed: $($routeFiles.Count)" 