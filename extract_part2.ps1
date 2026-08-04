$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$lines = [System.IO.File]::ReadAllLines($logPath)

$jsonStr = $lines[481] # line 482 is index 481
$obj = $jsonStr | ConvertFrom-Json
[System.IO.File]::WriteAllText('c:\New folder\part2_extracted.txt', $obj.content)
Write-Host "Wrote part2 content! Length: $($obj.content.Length)"
