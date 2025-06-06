$contentPath = Join-Path $PSScriptRoot "..\app\review\content"
$dirs = Get-ChildItem -Path $contentPath -Directory | Where-Object { $_.Name -like "*-reviews" }

foreach ($dir in $dirs) {
    $newName = $dir.Name -replace "-reviews$", ""
    $newPath = Join-Path $dir.Parent.FullName $newName
    
    Write-Host "Renaming '$($dir.Name)' to '$newName'"
    try {
        Move-Item -Path $dir.FullName -Destination $newPath -ErrorAction Stop
        Write-Host "Successfully renamed directory"
    } catch {
        Write-Host "Error renaming directory: $_" -ForegroundColor Red
    }
}
