$raw = [System.IO.File]::ReadAllText('c:\New folder\extracted_raw.txt')

# Remove JSON escape sequences (\n -> line break, \" -> ")
$clean = $raw.Replace('\n', "`n").Replace('\"', '"').Replace('\/', '/').Replace('\\', '\')

# Extract from <!DOCTYPE html> to </html>
$start = $clean.IndexOf('<!DOCTYPE html>')
$end = $clean.IndexOf('</html>')

if ($start -ge 0 -and $end -gt $start) {
    $html = $clean.Substring($start, ($end + 7) - $start)
    [System.IO.File]::WriteAllText('c:\New folder\original_html_but_in_text.txt', $html)
    Write-Host "Successfully restored original_html_but_in_text.txt ($($html.Length) bytes)!"
} else {
    Write-Host "Could not find HTML boundaries. Start: $start, End: $end"
}
