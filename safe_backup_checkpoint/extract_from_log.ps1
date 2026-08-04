$logPath = 'C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\.system_generated\logs\transcript_full.jsonl'
$text = [System.IO.File]::ReadAllText($logPath)

# Search for the string 'The USER performed the following action'
$idx = $text.LastIndexOf('original_html_but_in_text.txt')
if ($idx -gt 0) {
    Write-Host "Found original_html_but_in_text at character position $idx"
    $sub = $text.Substring($idx)
    [System.IO.File]::WriteAllText('c:\New folder\extracted_raw.txt', $sub)
    Write-Host "Saved snippet to extracted_raw.txt!"
} else {
    Write-Host "Not found"
}
