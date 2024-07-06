import { exec } from 'child_process';
import { readdir } from 'fs';
import { join } from 'path';

const testDirectory: string = './'; // Directory containing your test files

// Function to run a single test file
function runTest(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`ts-node ${file}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running ${file}: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Error in ${file}: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      console.log(`Success: ${file}\n${stdout}`);
      resolve(stdout);
    });
  });
}

// Function to find all test files and run them
function runAllTests(): void {
  readdir(testDirectory, (err, files) => {
    if (err) {
      console.error('Failed to list directory', err.message);
      return;
    }

    const testFiles = files.filter(file => file.endsWith('.test.ts'));

    Promise.all(testFiles.map(file => runTest(join(testDirectory, file))))
      .then(() => console.log('All tests completed successfully'))
      .catch(() => console.error('Some tests failed'));
  });
}

runAllTests();
