#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the fav-actors.json file
const actorsFilePath = path.join(__dirname, '../../data/film/fav-actors.json');

// Function to read the fav-actors.json file
function readActorsFile() {
  try {
    const data = fs.readFileSync(actorsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading actors file:', error.message);
    process.exit(1);
  }
}

// Function to write the fav-actors.json file
function writeActorsFile(actors) {
  try {
    // Read the existing file to preserve its formatting
    const existingContent = fs.readFileSync(actorsFilePath, 'utf8');
    
    // Extract indentation from the existing content
    const match = existingContent.match(/\n(\s*)"id":/);
    const indent = match ? match[1] : '  ';
    
    // Create the JSON string with preserved formatting
    let data = '[';
    actors.forEach((actor, index) => {
      data += '\n{';
      
      // Format each property, preserving the indentation
      Object.entries(actor).forEach(([key, value], propIndex) => {
        const valueStr = typeof value === 'string' 
          ? `"${value}"` 
          : Array.isArray(value) 
            ? JSON.stringify(value) 
            : value;
        
        data += `\n${indent}"${key}": ${valueStr}`;
        
        // Add comma if not the last property
        if (propIndex < Object.entries(actor).length - 1) {
          data += ',';
        }
      });
      
      data += '\n}';
      
      // Add comma if not the last actor
      if (index < actors.length - 1) {
        data += ',';
      }
    });
    
    data += '\n]';
    
    fs.writeFileSync(actorsFilePath, data, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing actors file:', error.message);
    return false;
  }
}

// Function to swap actors
function swapActors(actors, id1, id2) {
  const index1 = actors.findIndex(actor => actor.id === id1);
  const index2 = actors.findIndex(actor => actor.id === id2);

  if (index1 === -1 || index2 === -1) {
    return {
      success: false,
      message: `Could not find actor with ID ${index1 === -1 ? id1 : id2}`
    };
  }

  // Store names before swap for the message
  const name1 = actors[index1].name;
  const name2 = actors[index2].name;

  // Also swap the IDs since they represent positions
  const tempId = actors[index1].id;
  actors[index1].id = actors[index2].id;
  actors[index2].id = tempId;

  // Swap the actors in the array
  [actors[index1], actors[index2]] = [actors[index2], actors[index1]];

  return {
    success: true,
    message: `Successfully swapped "${name1}" and "${name2}"`
  };
}

// Display the actor list with IDs for selection
function displayActorList(actors) {
  console.log('\nCurrent Actor List:');
  console.log('----------------------------------------');
  
  actors.forEach((actor) => {
    const id = actor.id.padStart(2, ' ');
    const name = actor.name.padEnd(40, ' ');
    console.log(`${id} | ${name}`);
  });
  
  console.log('----------------------------------------\n');
}

async function promptForActorIds(actors) {
  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Function to ask a question and return a promise
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  console.log('Available actors:');
  actors.forEach(actor => {
    console.log(`ID: ${actor.id}, Name: ${actor.name}`);
  });

  // Ask for first actor ID
  const id1 = await question('\nEnter the ID of the first actor to swap: ');
  
  // Validate ID1
  if (!actors.some(actor => actor.id === id1)) {
    rl.close();
    throw new Error(`Actor with ID ${id1} not found`);
  }

  // Ask for second actor ID
  const id2 = await question('Enter the ID of the second actor to swap: ');
  
  // Validate ID2
  if (!actors.some(actor => actor.id === id2)) {
    rl.close();
    throw new Error(`Actor with ID ${id2} not found`);
  }

  // Close readline interface
  rl.close();

  return { id1, id2 };
}

async function main() {
  // Display a nice header
  console.log('\n==========================');
  console.log('     ACTOR SWAP TOOL');
  console.log('==========================\n');

  // Read the actors file
  const actors = readActorsFile();

  // Display the actor list
  displayActorList(actors);

  try {
    // Prompt for actor IDs
    const { id1, id2 } = await promptForActorIds(actors);

    // Swap the actors
    const result = swapActors(actors, id1, id2);

    if (result.success) {
      // Write the updated actors file
      if (writeActorsFile(actors)) {
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
