$backupDir = "C:\New folder\safe_backup_checkpoint"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
}

Copy-Item "C:\New folder\index.html" -Destination "$backupDir\index.html" -Force
Copy-Item "C:\New folder\combine.html" -Destination "$backupDir\combine.html" -Force

Get-ChildItem "C:\New folder\*.ps1" | ForEach-Object {
    Copy-Item $_.FullName -Destination $backupDir -Force
}

Write-Host "SUCCESS: Safe backup checkpoint saved in $backupDir"
