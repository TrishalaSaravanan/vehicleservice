Write-Host "Starting Angular tests in watch mode..."
Write-Host "This will open a Chrome browser window that stays open"
Write-Host "You can view the test results at: http://localhost:9876"
Write-Host ""

# Navigate to the correct directory and run tests
Set-Location "C:\Users\trish\Downloads\final1\vehicle_service_management"

# Try to run ng test directly
try {
    Write-Host "Running: npx ng test"
    & npx ng test
} catch {
    Write-Host "First approach failed, trying alternative..."
    try {
        & ".\node_modules\.bin\ng.cmd" test
    } catch {
        Write-Host "Alternative failed, trying direct karma..."
        & npx karma start --auto-watch --no-single-run
    }
}
