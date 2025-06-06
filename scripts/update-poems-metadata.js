const fs = require('fs');
const path = require('path');

// Read the poems.json file
const poemsPath = path.join(__dirname, '..', 'data', 'verse', 'poems.json');
const poems = JSON.parse(fs.readFileSync(poemsPath, 'utf8'));

// Update each poem entry
const updatedPoems = poems.map(poem => {
  // Default values for most poems
  const defaultValues = {
    status: "Finished",
    confidence: "certain",
    importance: 4
  };

  // Special cases
  if (poem.title === "Shall I Compare Thee to a Winter's Night?" || 
      poem.title === "Exaltatio Mortis or \"The Banquet of the Dead\"") {
    return {
      ...poem,
      status: "In Progress",
      confidence: "certain",
      importance: 4
    };
  }

  // Apply default values while preserving existing data
  return {
    ...poem,
    ...defaultValues
  };
});

// Write the updated data back to the file
fs.writeFileSync(poemsPath, JSON.stringify(updatedPoems, null, 2), 'utf8');

console.log('Successfully updated poems metadata!');
