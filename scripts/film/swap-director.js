#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the fav-directors.json file
const directorsFilePath = path.join(__dirname, '../../data/film/fav-directors.json');

// Function to read the fav-directors.json file
function readDirectorsFile() {
  try {
    const data = fs.readFileSync(directorsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading directors file:', error.message);
    process.exit(1);
  }
}

// Function to write the fav-directors.json file
function writeDirectorsFile(directors) {
  try {
    // Read the existing file to preserve its formatting
    const existingContent = fs.readFileSync(directorsFilePath, 'utf8');
    
    // Extract indentation from the existing content
    const match = existingContent.match(/\n(\s*)"id":/);
    const indent = match ? match[1] : '  ';
    
    // Create the JSON string with preserved formatting
    let data = '[';
    directors.forEach((director, index) => {
      data += '\n{';
      
      // Format each property, preserving the indentation
      Object.entries(director).forEach(([key, value], propIndex) => {
        const valueStr = typeof value === 'string' 
          ? `"${value}"` 
          : Array.isArray(value) 
            ? JSON.stringify(value) 
            : value;
        
        data += `\n${indent}"${key}": ${valueStr}`;
        
        // Add comma if not the last property
        if (propIndex < Object.entries(director).length - 1) {
          data += ',';
        }
      });
      
      data += '\n}';
      
      // Add comma if not the last director
      if (index < directors.length - 1) {
        data += ',';
      }
    });
    
    data += '\n]';
    
    fs.writeFileSync(directorsFilePath, data, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing directors file:', error.message);
    return false;
  }
}

// Function to swap directors
function swapDirectors(directors, id1, id2) {
  const index1 = directors.findIndex(director => director.id === id1);
  const index2 = directors.findIndex(director => director.id === id2);

  if (index1 === -1 || index2 === -1) {
    return {
      success: false,
      message: `Could not find director with ID ${index1 === -1 ? id1 : id2}`
    };
  }

  // Store names before swap for the message
  const name1 = directors[index1].name;
  const name2 = directors[index2].name;

  // Also swap the IDs since they represent positions
  const tempId = directors[index1].id;
  directors[index1].id = directors[index2].id;
  directors[index2].id = tempId;

  // Swap the directors in the array
  [directors[index1], directors[index2]] = [directors[index2], directors[index1]];

  return {
    success: true,
    message: `Successfully swapped "${name1}" and "${name2}"`
  };
}

// Display the director list with IDs for selection
function displayDirectorList(directors) {
  console.log('\nCurrent Director List:');
  console.log('----------------------------------------');
  
  directors.forEach((director) => {
    const id = director.id.padStart(2, ' ');
    const name = director.name.padEnd(40, ' ');
    console.log(`${id} | ${name}`);
  });
  
  console.log('----------------------------------------\n');
}

async function promptForDirectorIds(directors) {
  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Function to ask a question and return a promise
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  console.log('Available directors:');
  directors.forEach(director => {
    console.log(`ID: ${director.id}, Name: ${director.name}`);
  });

  // Ask for first director ID
  const id1 = await question('\nEnter the ID of the first director to swap: ');
  
  // Validate ID1
  if (!directors.some(director => director.id === id1)) {
    rl.close();
    throw new Error(`Director with ID ${id1} not found`);
  }

  // Ask for second director ID
  const id2 = await question('Enter the ID of the second director to swap: ');
  
  // Validate ID2
  if (!directors.some(director => director.id === id2)) {
    rl.close();
    throw new Error(`Director with ID ${id2} not found`);
  }

  // Close readline interface
  rl.close();

  return { id1, id2 };
}

async function main() {
  // Display a nice header
  console.log('\n==========================');
  console.log('   DIRECTOR SWAP TOOL');
  console.log('==========================\n');

  // Read the directors file
  const directors = readDirectorsFile();

  // Display the director list
  displayDirectorList(directors);

  try {
    // Prompt for director IDs
    const { id1, id2 } = await promptForDirectorIds(directors);

    // Swap the directors
    const result = swapDirectors(directors, id1, id2);

    if (result.success) {
      // Write the updated directors file
      if (writeDirectorsFile(directors)) {
        console.log('\n==========================');
        console.log(result.message);
        console.log('==========================\n');
      }
    } else {
      console.log('\n==========================');
      console.log(result.message);
      console.log('==========================\n');
    }
  } catch (error) {
    console.error('\nError:', error.message);
  }
}

// Run the main function
main();