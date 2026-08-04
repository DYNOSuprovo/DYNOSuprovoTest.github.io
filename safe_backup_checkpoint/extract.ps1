$content = Get-Content 'original_full_source.html' -Raw
if ($content -match '(?s)<style>(.*?)</style>') {
    Set-Content 'extracted_styles.css' $matches[1]
}
