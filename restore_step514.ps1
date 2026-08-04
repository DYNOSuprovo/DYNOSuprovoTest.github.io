$rawStep = [System.IO.File]::ReadAllText('c:\New folder\step_469.json')
$obj = $rawStep | ConvertFrom-Json

$content = $obj.content
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
    Write-Host "VICTORY! Restored $($finalHtml.Length) bytes ($($cleanLines.Count) lines) to original_html_but_in_text.txt!"
}
