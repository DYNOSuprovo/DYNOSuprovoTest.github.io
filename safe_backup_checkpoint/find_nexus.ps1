$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$lines = [System.IO.File]::ReadAllLines($logPath)

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -like '*nexusData.topo*' -or $lines[$i] -like '*nexusData.singularityUniforms*') {
        Write-Host "FOUND AT INDEX $i"
        $obj = $lines[$i] | ConvertFrom-Json
        if ($obj.content) {
            [System.IO.File]::WriteAllText("c:\New folder\nexus_script_$i.txt", $obj.content)
            Write-Host "Saved step $i"
        }
    }
}
