# Automate browser testing and screenshot capture
Write-Host "Opening http://localhost:8000/combine.html in browser..."
Start-Process "http://localhost:8000/combine.html"

# Wait for 4 seconds for pre-loader to finish sliding out
Start-Sleep -Seconds 4

# Take initial loaded page screenshot
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bmp = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.CopyFromScreen($bounds.X, $bounds.Y, 0, 0, $bounds.Size)

$outputPath1 = "C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\browser_hero_loaded.png"
$bmp.Save($outputPath1, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bmp.Dispose()
Write-Host "Captured $outputPath1"

# Send Page Down key to scroll down
[System.Windows.Forms.SendKeys]::SendWait("{PGDN}")
Start-Sleep -Seconds 1.5

# Take scrolled screenshot
$bmp2 = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$graphics2 = [System.Drawing.Graphics]::FromImage($bmp2)
$graphics2.CopyFromScreen($bounds.X, $bounds.Y, 0, 0, $bounds.Size)

$outputPath2 = "C:\Users\KIIT0001\.gemini\antigravity-ide\brain\b8fb03b0-af28-4d1b-b8be-e071d1567aff\browser_scrolled.png"
$bmp2.Save($outputPath2, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics2.Dispose()
$bmp2.Dispose()
Write-Host "Captured $outputPath2"
