$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$lines = [System.IO.File]::ReadAllLines($logPath)

Write-Host "Total JSONL lines: $($lines.Count)"

foreach ($l in $lines) {
    if ($l -like '*USER_EXPLICIT*' -and $l -like '*original_html_but_in_text*') {
        Write-Host "FOUND USER_EXPLICIT STEP!"
        [System.IO.File]::WriteAllText('c:\New folder\user_step.json', $l)
        break
    }
}
