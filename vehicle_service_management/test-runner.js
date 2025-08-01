// Simple test runner to verify our tests
const { execSync } = require('child_process');
const path = require('path');

console.log('Current directory:', process.cwd());
console.log('Package.json exists:', require('fs').existsSync('./package.json'));

try {
  // Try to run tests using the local Angular CLI in watch mode (keeps browser open)
  console.log('Starting tests in watch mode - browser will stay open...');
  const result = execSync('npx ng test', { 
    cwd: process.cwd(),
    stdio: 'inherit' 
  });
  console.log('Tests completed successfully');
} catch (error) {
  console.error('Error running tests:', error.message);
  
  // Try alternative approach
  try {
    console.log('Trying alternative approach...');
    const altResult = execSync('node_modules\\.bin\\ng test', { 
      cwd: process.cwd(),
      stdio: 'inherit' 
    });
    console.log('Alternative tests completed successfully');
  } catch (altError) {
    console.error('Alternative approach also failed:', altError.message);
  }
}
