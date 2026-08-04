$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$text = [System.IO.File]::ReadAllText($logPath)

$lastIdx = $text.LastIndexOf("[diff_block_start]")
$len = [Math]::Min(1000, $text.Length - $lastIdx)
$sub = $text.Substring($lastIdx, $len)
Write-Host $sub
