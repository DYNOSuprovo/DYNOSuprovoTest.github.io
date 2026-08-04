$raw = [System.IO.File]::ReadAllText('c:\New folder\step_469.json')
$idxStart = $raw.IndexOf("[diff_block_start]")

$diffStr = $raw.Substring($idxStart + 18)
$diffStr = $diffStr.Replace('\n', "`n").Replace('\"', '"').Replace('\/', '/').Replace('\\', '\')

$lines = $diffStr -split "`n"
$clean = @()
foreach ($l in $lines) {
    if ($l.StartsWith("+")) {
        $clean += $l.Substring(1)
    }
}
$html = $clean -join "`n"
[System.IO.File]::WriteAllText('c:\New folder\original_html_but_in_text.txt', $html)
Write-Host "VICTORY! Successfully restored $($html.Length) bytes ($($clean.Count) lines) to original_html_but_in_text.txt!"
