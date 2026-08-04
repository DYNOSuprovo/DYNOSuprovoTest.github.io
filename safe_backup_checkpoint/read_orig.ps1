$bytes = [System.IO.File]::ReadAllBytes('c:\New folder\original_html_but_in_text.txt')
Write-Host "Total Bytes: $($bytes.Length)"

$text = [System.Text.Encoding]::UTF8.GetString($bytes)
$text = $text.Replace("`r`n", "`n").Replace("`r", "`n")
$split = $text -split "`n"
Write-Host "Normalized lines count: $($split.Count)"

for ($i = 0; $i -lt $split.Count; $i++) {
    if ($split[$i] -match "THREE|nexusData|scene|Particle|webgl") {
        Write-Host "Line $($i+1): $($split[$i].Trim())"
    }
}
