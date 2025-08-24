const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const proofx = require('@proofofexistence/api-client');

const HASHES_PATH = path.join(__dirname, '../data/hashes.json');
const TARGET_FILES = [
  path.join(__dirname, '../data/poems.json'),
  path.join(__dirname, '../data/ocs.json'),
];
const BLOG_DIR = path.join(__dirname, '../blog');

function getAllFiles(dir, extList = ['.mdx', '.json']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getAllFiles(fullPath, extList));
    } else if (extList.includes(path.extname(fullPath))) {
      files.push(fullPath);
    }
  });
  return files;
}

function sha256File(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function getRelativePath(filePath) {
  return path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
}

function loadHashes() {
  if (!fs.existsSync(HASHES_PATH)) return {};
  try {
    const content = fs.readFileSync(HASHES_PATH, 'utf8');
    return content.trim() ? JSON.parse(content) : {};
  } catch {
    return {};
  }
}

function saveHashes(hashes) {
  fs.writeFileSync(HASHES_PATH, JSON.stringify(hashes, null, 2));
}

async function submitHashToPoE(hash) {
  try {
    const response = await proofx.submitHash(hash);
    // response.data contains the PoE proof info
    return response.data;
  } catch (error) {
    console.error(`Error submitting hash to PoE: ${error}`);
    return null;
  }
}

async function main() {
  const hashes = loadHashes();
  const files = [
    ...TARGET_FILES,
    ...getAllFiles(BLOG_DIR, ['.mdx', '.json']),
  ];

  const now = new Date().toISOString().slice(0, 10);

  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const relPath = getRelativePath(file);
    const hash = sha256File(file);

    if (!hashes[relPath]) hashes[relPath] = [];
    if (!hashes[relPath].some(entry => entry.sha256 === hash)) {
      // Submit to PoE
      const poeProof = await submitHashToPoE(hash);
      hashes[relPath].push({
        sha256: hash,
        timestamped_at: now,
        poe: poeProof || null,
      });
      console.log(`New hash for ${relPath}: ${hash} (PoE: ${poeProof ? 'submitted' : 'not submitted'})`);
    }
  }

  saveHashes(hashes);
}

main(); 