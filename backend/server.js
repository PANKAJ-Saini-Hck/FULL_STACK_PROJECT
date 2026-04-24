const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const db = require('./database');
const { runTool, checkToolInstalled } = require('./utils/toolRunner');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // For local dev flexibility
}));
app.use(morgan('dev'));
app.use(express.json());

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. Environment Status
app.get('/api/status', (req, res) => {
  const tools = [
    'steghide', 'zsteg', 'exiftool', 'strings', 'binwalk', 'ffmpeg', 
    'hashcat', 'john', 'gobuster', 'python', 'ruby', 'go', 'stegsolve', 'outguess', 'openstego', 'curl'
  ];
  
  const status = tools.reduce((acc, tool) => {
    acc[tool] = checkToolInstalled(tool);
    return acc;
  }, {});
  
  res.json({ success: true, status });
});

// 2. Generic Tool Run Endpoint
app.post('/api/run', upload.single('file'), async (req, res) => {
  const { tool, category, args = '' } = req.body;
  const file = req.file;

  let toolArgs = args.split(' ').filter(a => a.length > 0);

  // ── CRACKING special handling ──────────────────────────────────────────────
  // When category is CRACKING and tool is john/hashcat, we invoke cracker.py
  // and need to resolve the wordlist path from the uploaded file.
  if (category === 'CRACKING' && (tool === 'john' || tool === 'hashcat')) {
    const BIN_DIR = path.join(__dirname, 'bin');
    const pythonExe = process.platform === 'win32' ? 'python' : 'python3';
    const crackerScript = path.join(BIN_DIR, 'cracker.py');

    // Extract hash value
    const hashIdx = toolArgs.indexOf('--hash');
    const hashValue = hashIdx !== -1 ? toolArgs[hashIdx + 1] : null;
    if (!hashValue) {
      return res.json({ success: false, error: 'No hash provided for cracking.' });
    }

    // Resolve wordlist
    let wordlistArg = null;
    const wlIdx = toolArgs.indexOf('--wordlist');
    if (wlIdx !== -1) {
      const wlMode = toolArgs[wlIdx + 1];

      if (wlMode === 'custom' || wlMode === 'paste') {
        // Uploaded file (custom wordlist or pasted words saved to disk by multer)
        if (file) {
          wordlistArg = file.path;
          db.prepare(`INSERT INTO uploads (original_name, stored_name, file_path, file_type, size) VALUES (?, ?, ?, ?, ?)` )
            .run(file.originalname, file.filename, file.path, file.mimetype, file.size);
        }
      } else if (wlMode === 'rockyou') {
        const rycPath = path.join(BIN_DIR, 'rockyou.txt');
        if (fs.existsSync(rycPath)) {
          wordlistArg = rycPath;
        } else {
          console.log('[WARN] rockyou.txt not found in bin/, falling back to default.');
        }
      } else if (wlMode !== 'default' && fs.existsSync(wlMode)) {
        // Explicit path passed directly
        wordlistArg = wlMode;
      }
    }

    // Build cracker.py args
    const crackerArgs = ['--hash', hashValue];
    if (wordlistArg) {
      crackerArgs.push('--wordlist', wordlistArg);
    }

    console.log(`[CRACK] ${pythonExe} ${crackerScript} ${crackerArgs.join(' ')}`);
    const result = await runTool(pythonExe, [crackerScript, ...crackerArgs]);

    db.prepare(`INSERT INTO tool_logs (tool_name, category, input_params, output_text, error_text, status) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(tool, category, crackerArgs.join(' '), result.output, result.error, result.success ? 'SUCCESS' : 'FAILED');

    return res.json(result);
  }
  // ── END CRACKING ──────────────────────────────────────────────────────────

  if (file) {
    // For non-cracking tools: add file path to arguments
    const placeholderIndex = toolArgs.indexOf('{{FILE}}');
    if (placeholderIndex !== -1) {
      toolArgs[placeholderIndex] = file.path;
    } else {
      toolArgs.push(file.path);
    }

    db.prepare(`INSERT INTO uploads (original_name, stored_name, file_path, file_type, size) VALUES (?, ?, ?, ?, ?)` )
      .run(file.originalname, file.filename, file.path, file.mimetype, file.size);
  }

  const result = await runTool(tool, toolArgs);

  db.prepare(`INSERT INTO tool_logs (tool_name, category, input_params, output_text, error_text, status) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(tool, category, toolArgs.join(' '), result.output, result.error, result.success ? 'SUCCESS' : 'FAILED');

  res.json(result);
});

// 3. Web Exploitation (Internal logic for robots/sitemap)
app.post('/api/web/info', async (req, res) => {
  let { url, type } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  // Ensure protocol is present
  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }

  try {
    const isRobots = type.toLowerCase().includes('robots');
    const target = url.endsWith('/') 
      ? `${url}${isRobots ? 'robots.txt' : 'sitemap.xml'}` 
      : `${url}/${isRobots ? 'robots.txt' : 'sitemap.xml'}`;
    
    console.log(`[RECON] Fetching: ${target}`);
    const response = await fetch(target, { headers: { 'User-Agent': 'Mozilla/5.0 (CTF-Toolkit/1.0)' } });
    const text = await response.text();
    
    res.json({
      success: response.ok,
      output: response.ok ? text : `Failed to fetch ${type}. Status: ${response.status}`,
      status: response.status
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});


// History endpoint
app.get('/api/history', (req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM tool_logs ORDER BY timestamp DESC LIMIT 50`).all();
    res.json({ success: true, history: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n\x1b[32m[SYSTEM]\x1b[0m CTF Toolkit Backend running on port ${PORT}`);
});
