#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the fav-film-characters.json file
const charactersFilePath = path.join(__dirname, '../../data/film/fav-film-characters.json');

// Function to read the fav-film-characters.json file
function readCharactersFile() {
  try {
    const data = fs.readFileSync(charactersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading characters file:', error.message);
    process.exit(1);
  }
}

// Function to write the fav-film-characters.json file
function writeCharactersFile(characters) {
  try {
    // Read the existing file to preserve its formatting
    const existingContent = fs.readFileSync(charactersFilePath, 'utf8');
    
    // Extract indentation from the existing content
    const match = existingContent.match(/\n(\s*)"id":/);
    const indent = match ? match[1] : '  ';
    
    // Create the JSON string with preserved formatting
    let data = '[';
    characters.forEach((character, index) => {
      data += '\n{';
      
      // Format each property, preserving the indentation
      Object.entries(character).forEach(([key, value], propIndex) => {
        const valueStr = typeof value === 'string' 
          ? `"${value}"` 
          : Array.isArray(value) 
            ? JSON.stringify(value) 
            : value;
        
        data += `\n${indent}"${key}": ${valueStr}`;
        
        // Add comma if not the last property
        if (propIndex < Object.entries(character).length - 1) {
          data += ',';
        }
      });
      
      data += '\n}';
      
      // Add comma if not the last character
      if (index < characters.length - 1) {
        data += ',';
      }
    });
    
    data += '\n]';
    
    fs.writeFileSync(charactersFilePath, data, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing characters file:', error.message);
    return false;
  }
}

// Function to swap characters
function swapCharacters(characters, id1, id2) {
  const index1 = characters.findIndex(character => character.id === id1);
  const index2 = characters.findIndex(character => character.id === id2);

  if (index1 === -1 || index2 === -1) {
    return {
      success: false,
      message: `Could not find character with ID ${index1 === -1 ? id1 : id2}`
    };
  }

  // Store names before swap for the message
  const name1 = characters[index1].name;
  const name2 = characters[index2].name;

  // Also swap the IDs since they represent positions
  const tempId = characters[index1].id;
  characters[index1].id = characters[index2].id;
  characters[index2].id = tempId;

  // Swap the characters in the array
  [characters[index1], characters[index2]] = [characters[index2], characters[index1]];

  return {
    success: true,
    message: `Successfully swapped "${name1}" and "${name2}"`
  };
}

// Display the character list with IDs for selection
function displayCharacterList(characters) {
  console.log('\nCurrent Character List:');
  console.log('--------------------------------------------------------------------------------');
  
  characters.forEach((character) => {
    const id = character.id.padStart(2, ' ');
    const name = character.name.padEnd(30, ' ');
    const actor = character.actor ? character.actor.padEnd(30, ' ') : 'N/A'.padEnd(30, ' ');
    console.log(`${id} | ${name} | ${actor}`);
  });
  
  console.log('--------------------------------------------------------------------------------\n');
}

async function promptForCharacterIds(characters) {
  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Function to ask a question and return a promise
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  console.log('Available characters:');
  characters.forEach(character => {
    console.log(`ID: ${character.id}, Name: ${character.name}, Actor: ${character.actor || 'N/A'}`);
  });

  // Ask for first character ID
  const id1 = await question('\nEnter the ID of the first character to swap: ');
  
  // Validate ID1
  if (!characters.some(character => character.id === id1)) {
    rl.close();
    throw new Error(`Character with ID ${id1} not found`);
  }

  // Ask for second character ID
  const id2 = await question('Enter the ID of the second character to swap: ');
  
  // Validate ID2
  if (!characters.some(character => character.id === id2)) {
    rl.close();
    throw new Error(`Character with ID ${id2} not found`);
  }

  // Close readline interface
  rl.close();

  return { id1, id2 };
}

async function main() {
  // Display a nice header
  console.log('\n==============================');
  console.log('    CHARACTER SWAP TOOL');
  console.log('==============================\n');

  // Read the characters file
  const characters = readCharactersFile();

  // Display the character list
  displayCharacterList(characters);

  try {
    // Prompt for character IDs
    const { id1, id2 } = await promptForCharacterIds(characters);

    // Swap the characters
    const result = swapCharacters(characters, id1, id2);

    if (result.success) {
      // Write the updated characters file
      if (writeCharactersFile(characters)) {
        console.log('\n==============================');
        console.log(result.message);
        console.log('==============================\n');
      }
    } else {
      console.log('\n==============================');
      console.log(result.message);
      console.log('==============================\n');
    }
  } catch (error) {
    console.error('\nError:', error.message);
  }
}

// Run the main function
main();
