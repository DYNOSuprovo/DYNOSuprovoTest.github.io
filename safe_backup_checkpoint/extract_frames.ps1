Add-Type -AssemblyName PresentationCore, PresentationFramework, WindowsBase

$videoPath = "C:\New folder\lv_0_20260803013559.mp4"
$outputDir = "C:\New folder\frames"
if (-not (Test-Path $outputDir)) { New-Item -ItemType Directory -Force -Path $outputDir | Out-Null }

Write-Host "Extracting frames from $videoPath to $outputDir using WPF MediaPlayer..."

$player = New-Object System.Windows.Media.MediaPlayer
$player.ScrubbingEnabled = $true
$player.Open((New-Object System.Uri($videoPath)))

# Wait for video duration
$timeout = 100
while (-not $player.NaturalDuration.HasTimeSpan -and $timeout -gt 0) {
    Start-Sleep -Milliseconds 100
    $timeout--
}

if (-not $player.NaturalDuration.HasTimeSpan) {
    Write-Host "Failed to load video duration."
    exit 1
}

$duration = $player.NaturalDuration.TimeSpan.TotalSeconds
Write-Host "Video Duration: $duration seconds"

$totalFrames = 1500
$step = $duration / $totalFrames

$width = $player.NaturalVideoWidth
$height = $player.NaturalVideoHeight
if ($width -eq 0) { $width = 1280; $height = 720 }

Write-Host "Resolution: ${width}x${height} | Frames to extract: $totalFrames"

$drawingVisual = New-Object System.Windows.Media.DrawingVisual
$drawingContext = $drawingVisual.RenderOpen()
$drawingContext.DrawVideo($player, (New-Object System.Windows.Rect(0, 0, $width, $height)))
$drawingContext.Close()

for ($i = 0; $i -lt $totalFrames; $i++) {
    $timeSec = $i * $step
    $player.Position = [System.TimeSpan]::FromSeconds($timeSec)
    Start-Sleep -Milliseconds 40 # allow decoder to catch up

    $rtb = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($width, $height, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
    $rtb.Render($drawingVisual)

    $encoder = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
    $encoder.QualityLevel = 85
    $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($rtb))

    $frameNum = ($i + 1).ToString("0000")
    $filePath = Join-Path $outputDir "frame_${frameNum}.jpg"

    $stream = [System.IO.File]::Create($filePath)
    $encoder.Save($stream)
    $stream.Close()

    if ($i % 15 -eq 0) {
        Write-Host "Extracted frame $frameNum / $totalFrames (t=$($timeSec.ToString('0.00'))s)"
    }
}

$player.Close()
Write-Host "SUCCESS: Extracted $totalFrames frames to $outputDir"
