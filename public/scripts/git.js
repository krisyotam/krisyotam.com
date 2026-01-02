const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Commit message: ', (msg) => {
  try {
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });
    execSync('git checkout -B main', { stdio: 'inherit' });
    execSync('git push -u origin main', { stdio: 'inherit' });
  } catch (err) {
    console.error('\n❌ Git error:', err.message);
  } finally {
    rl.close();
  }
});
