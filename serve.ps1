# HTTP Server with Range Requests & Frame Saver Endpoint
$port = 8000
$basePath = "c:\New folder"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "=== Video & Frame Scrub Server ==="
Write-Host "Serving: $basePath"
Write-Host "URL: http://localhost:$port/"
Write-Host "Frame Upload Endpoint: POST /upload-frame?name=filename.jpg"
Write-Host "Press Ctrl+C to stop."

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".json" = "application/json"
    ".woff2"= "font/woff2"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $urlPath = $request.Url.LocalPath

            # Handle Frame Upload POST requests
            if ($request.HttpMethod -eq "POST" -and $urlPath -eq "/upload-frame") {
                $fileName = $request.QueryString["name"]
                if (-not $fileName) { $fileName = "frame_" + (Get-Date -Format "yyyyMMddHHmmssfff") + ".jpg" }
                $savePath = Join-Path (Join-Path $basePath "frames") $fileName

                $ms = New-Object System.IO.MemoryStream
                $request.InputStream.CopyTo($ms)
                [System.IO.File]::WriteAllBytes($savePath, $ms.ToArray())
                $ms.Close()

                $response.StatusCode = 200
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $msg = [System.Text.Encoding]::UTF8.GetBytes("OK: Saved $fileName")
                $response.OutputStream.Write($msg, 0, $msg.Length)
                $response.Close()
                continue
            }

            # CORS preflight
            if ($request.HttpMethod -eq "OPTIONS") {
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Range")
                $response.StatusCode = 200
                $response.Close()
                continue
            }

            if ($urlPath -eq "/") { $urlPath = "/index.html" }
            $filePath = Join-Path $basePath ($urlPath.TrimStart('/'))

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                
                $fileInfo = Get-Item $filePath
                $totalLength = $fileInfo.Length
                
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Accept-Ranges", "bytes")
                $response.AddHeader("Cache-Control", "public, max-age=3600")
                
                $rangeHeader = $request.Headers["Range"]
                
                if ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
                    $rangeSpec = $rangeHeader.Substring(6)
                    $parts = $rangeSpec.Split('-')
                    
                    $rangeStart = 0
                    $rangeEnd = $totalLength - 1
                    
                    if ($parts[0] -ne "") { $rangeStart = [long]$parts[0] }
                    if ($parts.Length -gt 1 -and $parts[1] -ne "") { $rangeEnd = [long]$parts[1] }
                    if ($rangeEnd -ge $totalLength) { $rangeEnd = $totalLength - 1 }
                    
                    $contentLength = $rangeEnd - $rangeStart + 1
                    
                    $response.StatusCode = 206
                    $response.ContentType = $contentType
                    $response.ContentLength64 = $contentLength
                    $response.AddHeader("Content-Range", "bytes $rangeStart-$rangeEnd/$totalLength")
                    
                    $fs = [System.IO.File]::OpenRead($filePath)
                    $fs.Seek($rangeStart, [System.IO.SeekOrigin]::Begin) | Out-Null
                    
                    $buffer = New-Object byte[] 65536
                    $remaining = $contentLength
                    while ($remaining -gt 0) {
                        $toRead = [Math]::Min($buffer.Length, $remaining)
                        $bytesRead = $fs.Read($buffer, 0, $toRead)
                        if ($bytesRead -eq 0) { break }
                        $response.OutputStream.Write($buffer, 0, $bytesRead)
                        $remaining -= $bytesRead
                    }
                    $fs.Close()
                }
                else {
                    $response.StatusCode = 200
                    $response.ContentType = $contentType
                    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
                    $response.ContentLength64 = $fileBytes.Length
                    $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
                }
            }
            else {
                $response.StatusCode = 404
                $errorBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
                $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
            }
            
            $response.Close()
        } catch {
            # Ignore client disconnect exceptions
        }
    }
} finally {
    $listener.Stop()
}
