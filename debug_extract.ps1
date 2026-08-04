$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$text = [System.IO.File]::ReadAllText($logPath)

$sub = $text.Substring(1235102, 2000)
Write-Host "Length of sub: $($sub.Length)"
[System.IO.File]::WriteAllText('c:\New folder\debug_block.txt', $sub)
Write-Host "Saved debug block to debug_block.txt"
