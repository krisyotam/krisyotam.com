// Script to add "state": "active" to each entry in reviews.json
const fs = require('fs');
const path = require('path');

// Path to the reviews.json file
const filePath = path.join(__dirname, '..', 'data', 'reviews', 'reviews.json');

// Read the file
try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Parse the JSON content
  const reviews = JSON.parse(fileContent);
  
  // Add state field to each entry
  const updatedReviews = reviews.map(review => {
    return {
      ...review,
      state: "active"
    };
  });
  
  // Write the updated content back to the file
  const updatedContent = JSON.stringify(updatedReviews, null, 2);
  fs.writeFileSync(filePath, updatedContent);
  
  console.log(`Successfully added "state": "active" to ${reviews.length} reviews.`);
} catch (error) {
  console.error('Error processing reviews.json:', error);
}
