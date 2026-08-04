Add-Type -AssemblyName PresentationCore, PresentationFramework, WindowsBase

$videoPath = "C:\New folder\lv_0_20260803013559.mp4"
$outputDir = "C:\New folder\frames"
if (-not (Test-Path $outputDir)) { 
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null 
} else {
    # Clean previous frames to re-divide cleanly
    Remove-Item -Path "$outputDir\*.jpg" -Force -ErrorAction SilentlyContinue
}

Write-Host "Extracting 1,200 Fast-Forwarded (1.25x Speed) frames from $videoPath to $outputDir..."

$player = New-Object System.Windows.Media.MediaPlayer
$player.ScrubbingEnabled = $true
$loaded = $false

$player.add_MediaOpened({
    $script:loaded = $true
})

$player.Open((New-Object System.Uri($videoPath)))

# Wait for video duration
$timeout = 200
while (-not $loaded -and -not $player.NaturalDuration.HasTimeSpan -and $timeout -gt 0) {
    Start-Sleep -Milliseconds 150
    $timeout--
}

if (-not $player.NaturalDuration.HasTimeSpan) {
    Start-Sleep -Seconds 2
}

if (-not $player.NaturalDuration.HasTimeSpan) {
    Write-Host "Failed to load video duration."
    exit 1
}

$duration = $player.NaturalDuration.TimeSpan.TotalSeconds
Write-Host "Raw Video Duration: $duration seconds"

$totalFrames = 1200
$step = $duration / $totalFrames

$width = $player.NaturalVideoWidth
$height = $player.NaturalVideoHeight
if ($width -eq 0) { $width = 1920; $height = 1080 }

Write-Host "Resolution: ${width}x${height} | Re-dividing into $totalFrames fast-forwarded frames..."

$bmp = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($width, $height, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
$drawingVisual = New-Object System.Windows.Media.DrawingVisual

for ($i = 1; $i -le $totalFrames; $i++) {
    $timePos = ($i - 1) * $step
    $player.Position = [System.TimeSpan]::FromSeconds($timePos)
    
    # Fast frame seek delay
    Start-Sleep -Milliseconds 18
    
    $drawingContext = $drawingVisual.RenderOpen()
    $drawingContext.DrawVideo($player, (New-Object System.Windows.Rect(0, 0, $width, $height)))
    $drawingContext.Close()
    
    $bmp.Render($drawingVisual)
    
    $encoder = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
    $encoder.QualityLevel = 88
    $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bmp))
    
    $frameName = "frame_" + $i.ToString("D4") + ".jpg"
    $framePath = Join-Path $outputDir $frameName
    
    $stream = [System.IO.File]::Create($framePath)
    $encoder.Save($stream)
    $stream.Close()
    
    if ($i % 25 -eq 0 -or $i -eq $totalFrames) {
        Write-Host "Extracted frame $($i.ToString('D4')) / $totalFrames (t=$([Math]::Round($timePos, 2))s)"
    }
}

$player.Close()
Write-Host "SUCCESS: Re-divided and extracted $totalFrames fast-forwarded frames to $outputDir"
