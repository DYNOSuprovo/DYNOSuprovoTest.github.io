$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$text = [System.IO.File]::ReadAllText($logPath)

$searchStr = "+<!DOCTYPE html>"
$idx = $text.LastIndexOf($searchStr)

if ($idx -gt 0) {
    Write-Host "Found +<!DOCTYPE html> at position $idx"
    $sub = $text.Substring($idx, [Math]::Min(100000, $text.Length - $idx))
    
    # Process lines
    $lines = $sub -split "\n"
    $cleanLines = @()
    foreach ($l in $lines) {
        if ($l.StartsWith("+")) {
            $cleanLines += $l.Substring(1)
        } elseif ($l.StartsWith("+\\n")) {
            $cleanLines += ""
        }
    }
    
    # Unescape JSON
    $htmlText = ($cleanLines -join "`n").Replace('\"', '"').Replace('\/', '/').Replace('\\', '\').Replace('\n', "`n")
    [System.IO.File]::WriteAllText('c:\New folder\original_html_but_in_text.txt', $htmlText)
    Write-Host "Successfully wrote $($cleanLines.Count) lines to original_html_but_in_text.txt!"
} else {
    Write-Host "Could not find +<!DOCTYPE html>"
}
