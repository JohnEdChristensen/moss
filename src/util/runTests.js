import { exec } from 'child_process';
import { readdir } from 'fs';
import { join } from 'path';

const testDirectory = './'; // Directory containing your test files

// Function to run a single test file
function runTest(file) {
  return new Promise((resolve, reject) => {
    exec(`ts-node ${file}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running ${file}: ${error}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Error in ${file}: ${stderr}`);
        return reject(new Error(stderr));
      }
      console.log(`Success: ${file}\n${stdout}`);
      resolve(stdout);
    });
  });
}

// Function to find all test files and run them
function runAllTests() {
  readdir(testDirectory, (err, files) => {
    if (err) {
      return console.error('Failed to list directory', err);
    }

    const testFiles = files.filter(file => file.endsWith('.test.ts'));

    Promise.all(testFiles.map(file => runTest(join(testDirectory, file))))
      .then(() => console.log('All tests completed successfully'))
      .catch(() => console.error('Some tests failed'));
  });
}

runAllTests();
