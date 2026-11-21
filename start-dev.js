const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('====================================================');
console.log('🚀 Starting LearnHub Full-Stack Platform');
console.log('====================================================\n');

// Start backend
const backend = spawn('npm', ['run', 'start'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true
});

// Start frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nShutting down LearnHub servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
