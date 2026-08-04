$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$text = [System.IO.File]::ReadAllText($logPath)

$token = "[diff_block_start]"
$lastIdx = $text.LastIndexOf($token)

if ($lastIdx -gt 0) {
    Write-Host "Found diff block at $lastIdx"
    $endIdx = $text.IndexOf("[diff_block_end]", $lastIdx)
    if ($endIdx -gt $lastIdx) {
        $block = $text.Substring($lastIdx, $endIdx - $lastIdx)
        # Parse diff lines starting with +
        $lines = $block -split "\n"
        $code = @()
        foreach ($line in $lines) {
            if ($line.StartsWith("+")) {
                # Trim leading +
                $clean = $line.Substring(1)
                # Unescape \n if stringified
                $clean = $clean.Replace('\n', "`n").Replace('\"', '"').Replace('\/', '/').Replace('\\', '\')
                $code += $clean
            }
        }
        $result = $code -join "`n"
        [System.IO.File]::WriteAllText('c:\New folder\original_html_but_in_text.txt', $result)
        Write-Host "Wrote $($result.Length) bytes to original_html_but_in_text.txt!"
    }
}
