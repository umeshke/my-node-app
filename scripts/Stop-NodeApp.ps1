# Kill existing Node processes
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
Write-Host "Stopped existing Node processes"
