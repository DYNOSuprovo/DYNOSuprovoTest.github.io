$txt = Get-Content 'original_html_but_in_text.txt' -Raw
if ($txt -match '(?s)<style>(.*?)</style>') {
    Add-Content 'styles.css' $matches[1]
}
if ($txt -match '(?s)<script>(.*?)</html>') {
    Set-Content 'extracted_script.js' $matches[1]
}
