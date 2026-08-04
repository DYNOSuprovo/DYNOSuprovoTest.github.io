$jsonText = [System.IO.File]::ReadAllText('c:\New folder\user_step.json')
$obj = $jsonText | ConvertFrom-Json

$content = $obj.content
Write-Host "Content length: $($content.Length)"

# Extract diff block
$dStart = $content.IndexOf("[diff_block_start]")
$dEnd = $content.IndexOf("[diff_block_end]")

if ($dStart -gt 0 -and $dEnd -gt $dStart) {
    $diff = $content.Substring($dStart + 18, $dEnd - ($dStart + 18))
    $lines = $diff -split "`n"
    $cleanLines = @()
    foreach ($l in $lines) {
        if ($l.StartsWith("+")) {
            $cleanLines += $l.Substring(1)
        }
    }
    $finalHtml = $cleanLines -join "`n"
    [System.IO.File]::WriteAllText('c:\New folder\original_html_but_in_text.txt', $finalHtml)
    Write-Host "SUCCESSFULLY RESTORED $($finalHtml.Length) bytes ($($cleanLines.Count) lines) to original_html_but_in_text.txt!"
} else {
    Write-Host "Could not find diff block boundaries in user_step.json"
}
