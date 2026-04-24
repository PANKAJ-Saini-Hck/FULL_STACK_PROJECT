const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BIN_DIR = path.join(__dirname, '..', 'bin');

/**
 * Utility to check if a command is available in the system PATH or local bin
 */
const checkToolInstalled = (cmd) => {
  // Check local bin first
  if (process.platform === 'win32') {
    const exts = ['.exe', '.bat', '.cmd', ''];
    for (let ext of exts) {
      if (fs.existsSync(path.join(BIN_DIR, `${cmd}${ext}`))) return true;
    }
  } else {
    if (fs.existsSync(path.join(BIN_DIR, cmd))) return true;
  }

  try {
    const whichCmd = process.platform === 'win32' ? 'where' : 'which';
    try {
      execSync(`${whichCmd} ${cmd}`, { stdio: 'ignore' });
      return true;
    } catch (e) {
      if (cmd === 'python' && process.platform !== 'win32') {
        execSync(`${whichCmd} python3`, { stdio: 'ignore' });
        return true;
      }
      return false;
    }
  } catch (e) {
    return false;
  }
};

/**
 * Safely executes a CLI tool and returns a promise with the output
 * @param {string} cmd - The command to run
 * @param {string[]} args - Array of arguments
 * @param {object} options - Options (cwd, env, etc.)
 */
const runTool = (cmd, args = [], options = {}) => {
  return new Promise((resolve) => {
    console.log(`Executing: ${cmd} ${args.join(' ')}`);
    
    // Check if tool exists first
    if (!checkToolInstalled(cmd)) {
      resolve({
        success: false,
        error: `Tool '${cmd}' is not installed or not in PATH.`,
        output: ''
      });
      return;
    }

    // Prepare environment PATH to include our local bin
    const env = { 
      ...process.env, 
      PATH: `${BIN_DIR}${path.delimiter}${process.env.PATH}`,
      ...options.env
    };

    const child = spawn(cmd, args, {
      shell: true, // Needed for many Windows commands
      ...options,
      env
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        success: code === 0,
        code,
        output: stdout,
        error: stderr
      });
    });

    child.on('error', (err) => {
      resolve({
        success: false,
        error: err.message,
        output: stdout
      });
    });
  });
};

module.exports = {
  runTool,
  checkToolInstalled
};
