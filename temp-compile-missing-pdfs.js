const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// Directories
const docsDir = path.join(__dirname, 'app', 'legal', 'documents');
const outputDir = path.join(__dirname, 'app', 'legal', 'pdfs');

// Make sure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to fix em-dashes in comments (which can cause LaTeX compilation issues)
async function fixEmDashesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace em-dashes in comments with regular hyphens
    const fixedContent = content.replace(/(%.*?)—/g, (match, comment) => {
      return comment + '-';
    });
    
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Fixed em-dashes in: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`Error fixing em-dashes in ${filePath}:`, err);
  }
}

// Get all .tex files
const texFiles = fs.readdirSync(docsDir)
  .filter(file => file.endsWith('.tex') && file !== 'research.tex')
  .map(file => file.replace('.tex', ''));

// Find which files don't have PDFs
const missingPdfs = texFiles.filter(basename => {
  const pdfPath = path.join(outputDir, `${basename}.pdf`);
  return !fs.existsSync(pdfPath);
});

console.log(`Found ${missingPdfs.length} missing PDFs to generate: ${missingPdfs.join(', ')}`);

// Process each missing PDF
async function processFile(basename) {
  const texFile = path.join(docsDir, `${basename}.tex`);
  const outputPdf = path.join(outputDir, `${basename}.pdf`);
  
  console.log(`Processing ${basename}...`);
  
  try {
    // Fix em-dashes that might be causing issues
    await fixEmDashesInFile(texFile);
    
    // Compile with pdflatex (twice to resolve references)
    const cmd = `pdflatex -output-directory="${docsDir}" "${texFile}"`;
    console.log(`Running: ${cmd}`);
    
    await execPromise(cmd);
    await execPromise(cmd); // Run twice for references
    
    // Move the PDF to output directory
    const generatedPdf = path.join(docsDir, `${basename}.pdf`);
    if (fs.existsSync(generatedPdf)) {
      fs.copyFileSync(generatedPdf, outputPdf);
      console.log(`✓ Generated PDF for ${basename}`);
      
      // Clean up auxiliary files
      const auxExtensions = ['.aux', '.log', '.out', '.toc', '.lof', '.lot'];
      auxExtensions.forEach(ext => {
        const auxFile = path.join(docsDir, `${basename}${ext}`);
        if (fs.existsSync(auxFile)) {
          fs.unlinkSync(auxFile);
        }
      });
      
      // Delete the PDF from the source directory (we've already copied it)
      fs.unlinkSync(generatedPdf);
    } else {
      console.error(`✗ Failed to generate PDF for ${basename}`);
    }
  } catch (err) {
    console.error(`Error processing ${basename}:`, err);
  }
}

// Process files sequentially to avoid resource conflicts
async function processAll() {
  for (const basename of missingPdfs) {
    await processFile(basename);
  }
  console.log('Finished processing all missing PDFs.');
}

processAll()
  .then(() => {
    // Clean up this script after it's done
    //fs.unlinkSync(__filename);
    console.log('Done. You can now delete this temporary script file.');
  })
  .catch(err => {
    console.error('Error during processing:', err);
  });