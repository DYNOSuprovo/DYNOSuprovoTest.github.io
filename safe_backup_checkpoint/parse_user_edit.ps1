$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$text = [System.IO.File]::ReadAllText($logPath)

$idx = $text.LastIndexOf("original_html_but_in_text")
while ($idx -gt 0) {
    $sub = $text.Substring($idx, [Math]::Min(500, $text.Length - $idx))
    if ($sub -like "*diff_block_start*") {
        Write-Host "FOUND MATCH AT POS $idx !"
        $endIdx = $text.IndexOf("[diff_block_end]", $idx)
        if ($endIdx -gt $idx) {
            $block = $text.Substring($idx, $endIdx - $idx)
            # Unescape
            $block = $block.Replace('\n', "`n").Replace('\"', '"').Replace('\/', '/').Replace('\\', '\')
            $lines = $block -split "`n"
            $code = @()
            foreach ($l in $lines) {
                if ($l.StartsWith("+")) {
                    $code += $l.Substring(1)
                }
            }
            $res = $code -join "`n"
            [System.IO.File]::WriteAllText('c:\New folder\original_html_but_in_text.txt', $res)
            Write-Host "Successfully saved $($res.Length) bytes ($($code.Count) lines) to original_html_but_in_text.txt!"
            break
        }
    }
    $idx = $text.LastIndexOf("original_html_but_in_text", $idx - 1)
}
