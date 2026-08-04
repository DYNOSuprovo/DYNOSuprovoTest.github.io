$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$lines = [System.IO.File]::ReadAllLines($logPath)

for ($i = 470; $i -lt [Math]::Min(520, $lines.Count); $i++) {
    if ($lines[$i] -like '*nexusData*' -or $lines[$i] -like '*THREE.Scene*' -or $lines[$i] -like '*singularity*') {
        Write-Host "Found match in line $($i+1)"
        [System.IO.File]::WriteAllText("c:\New folder\part2_$i.txt", $lines[$i])
    }
}
