$raw = [System.IO.File]::ReadAllText('c:\New folder\extracted_raw.txt')
Write-Host "Raw snippet length: $($raw.Length)"
Write-Host "First 300 chars:"
Write-Host $raw.Substring(0, [Math]::Min(300, $raw.Length))
