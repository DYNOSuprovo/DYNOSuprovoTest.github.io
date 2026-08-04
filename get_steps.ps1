$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$lines = [System.IO.File]::ReadAllLines($logPath)

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -like '*step_index":514*' -or $lines[$i] -like '*step_index":515*') {
        Write-Host "Found step $($i+1): $($lines[$i].Substring(0, [Math]::Min(150, $lines[$i].Length)))"
        [System.IO.File]::WriteAllText("c:\New folder\step_$i.json", $lines[$i])
    }
}
