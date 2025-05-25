const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// Directories
const docsDir = path.join(process.cwd(), 'app', 'legal', 'documents');
const publicDir = path.join(process.cwd(), 'public', 'legal', 'documents');
const pdfsDir = path.join(process.cwd(), 'app', 'legal', 'pdfs');

// Problematic files
const filesToFix = [
  'privacy-policy.tex',
  'terms-of-use.tex'
];

// Clean up duplicate PDFs in the documents directory
// The correct location for PDFs is in public/legal/documents
console.log('Cleaning up duplicate PDFs in app/legal/documents...');
fs.readdirSync(docsDir)
  .filter(file => file.endsWith('.pdf'))
  .forEach(file => {
    const filePath = path.join(docsDir, file);
    fs.unlinkSync(filePath);
    console.log(`Deleted duplicate PDF from documents directory: ${file}`);
  });

// Clean up duplicate PDFs in the app/legal/pdfs directory
console.log('Cleaning up duplicate PDFs in app/legal/pdfs...');
if (fs.existsSync(pdfsDir)) {
  fs.readdirSync(pdfsDir)
    .filter(file => file.endsWith('.pdf'))
    .forEach(file => {
      const filePath = path.join(pdfsDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted PDF from pdfs directory: ${file}`);
    });
  
  // Remove the pdfs directory if it's now empty
  if (fs.readdirSync(pdfsDir).length === 0) {
    fs.rmdirSync(pdfsDir);
    console.log('Removed empty pdfs directory');
  }
}

// Function to fix em-dashes in comments
async function fixEmDashesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace em-dashes in comments with regular hyphens
    // This specifically targets the %— pattern
    const fixedContent = content.replace(/(%[^\n]*?)—/g, (match, comment) => {
      return comment + '-';
    });
    
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Fixed em-dashes in: ${path.basename(filePath)}`);
    return true;
  } catch (err) {
    console.error(`Error fixing em-dashes in ${filePath}:`, err);
    return false;
  }
}

// Process each problematic file
async function processFile(fileName) {
  const texFile = path.join(docsDir, fileName);
  const outputPdf = path.join(publicDir, fileName.replace('.tex', '.pdf'));
  
  console.log(`Processing ${fileName}...`);
  
  try {
    // Fix em-dashes that are causing issues
    await fixEmDashesInFile(texFile);
    
    // Compile with pdflatex (twice to resolve references)
    const cmd = `pdflatex -output-directory="${docsDir}" "${texFile}"`;
    console.log(`Running: ${cmd}`);
    
    await execPromise(cmd);
    console.log(`First pass completed for ${fileName}`);
    await execPromise(cmd); // Run twice for references
    console.log(`Second pass completed for ${fileName}`);
    
    // Move the PDF to the public directory
    const generatedPdf = path.join(docsDir, fileName.replace('.tex', '.pdf'));
    if (fs.existsSync(generatedPdf)) {
      // Ensure output directory exists
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      fs.copyFileSync(generatedPdf, outputPdf);
      console.log(`✓ Generated and copied PDF for ${fileName}`);
      
      // Clean up auxiliary files
      const auxExtensions = ['.aux', '.log', '.out', '.toc', '.lof', '.lot'];
      auxExtensions.forEach(ext => {
        const auxFile = path.join(docsDir, fileName.replace('.tex', ext));
        if (fs.existsSync(auxFile)) {
          fs.unlinkSync(auxFile);
        }
      });
      
      // Delete the PDF from the source directory (we've already copied it)
      fs.unlinkSync(generatedPdf);
    } else {
      console.error(`✗ Failed to generate PDF for ${fileName}`);
    }
  } catch (err) {
    console.error(`Error processing ${fileName}:`, err);
  }
}

// Process files sequentially
async function processAll() {
  for (const fileName of filesToFix) {
    await processFile(fileName);
  }
  console.log('Finished processing all remaining files.');
}

// Run the script
processAll()
  .then(() => console.log('Done!'))
  .catch(err => console.error('Error during processing:', err));
