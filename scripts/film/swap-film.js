#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the movies.json file
const moviesFilePath = path.join(__dirname, '../../data/film/movies.json');

// Function to read the movies.json file
function readMoviesFile() {
  try {
    const data = fs.readFileSync(moviesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading movies file:', error.message);
    process.exit(1);
  }
}

// Function to write the movies.json file
function writeMoviesFile(movies) {
  try {
    // Read the existing file to preserve its formatting
    const existingContent = fs.readFileSync(moviesFilePath, 'utf8');
    
    // Extract indentation from the existing content
    const match = existingContent.match(/\n(\s*)"id":/);
    const indent = match ? match[1] : '';
    
    // Create the JSON string with preserved formatting
    let data = '[';
    movies.forEach((movie, index) => {
      data += '\n{';
      
      // Format each property, preserving the indentation
      Object.entries(movie).forEach(([key, value], propIndex) => {
        const valueStr = typeof value === 'string' 
          ? `"${value}"` 
          : Array.isArray(value) 
            ? JSON.stringify(value) 
            : value;
        
        data += `\n${indent}"${key}": ${valueStr}`;
        
        // Add comma if not the last property
        if (propIndex < Object.entries(movie).length - 1) {
          data += ',';
        }
      });
      
      data += '\n}';
      
      // Add comma if not the last movie
      if (index < movies.length - 1) {
        data += ',';
      }
    });
    
    data += '\n]';
    
    fs.writeFileSync(moviesFilePath, data, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing movies file:', error.message);
    return false;
  }
}

// Function to swap movies
function swapMovies(movies, id1, id2) {
  const index1 = movies.findIndex(movie => movie.id === id1);
  const index2 = movies.findIndex(movie => movie.id === id2);

  if (index1 === -1 || index2 === -1) {
    return {
      success: false,
      message: `Could not find movie with ID ${index1 === -1 ? id1 : id2}`
    };
  }

  // Store titles before swap for the message
  const title1 = movies[index1].title;
  const title2 = movies[index2].title;

  // Also swap the IDs since they represent positions
  const tempId = movies[index1].id;
  movies[index1].id = movies[index2].id;
  movies[index2].id = tempId;

  // Swap the movies in the array
  [movies[index1], movies[index2]] = [movies[index2], movies[index1]];

  return {
    success: true,
    message: `Successfully swapped "${title1}" and "${title2}"`
  };
}

// Display the movie list with IDs for selection
function displayMovieList(movies) {
  console.log('\nCurrent Movie List:');
  console.log('----------------------------------------');
  
  movies.forEach((movie) => {
    const id = movie.id.padStart(2, ' ');
    const title = movie.title.padEnd(40, ' ');
    const year = movie.year.toString();
    console.log(`${id} | ${title} | ${year}`);
  });
  
  console.log('----------------------------------------\n');
}

async function promptForMovieIds(movies) {
  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Function to ask a question and return a promise
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  console.log('Available movies:');
  movies.forEach(movie => {
    console.log(`ID: ${movie.id}, Title: ${movie.title} (${movie.year})`);
  });

  // Ask for first movie ID
  const id1 = await question('\nEnter the ID of the first movie to swap: ');
  
  // Validate ID1
  if (!movies.some(movie => movie.id === id1)) {
    rl.close();
    throw new Error(`Movie with ID ${id1} not found`);
  }

  // Ask for second movie ID
  const id2 = await question('Enter the ID of the second movie to swap: ');
  
  // Validate ID2
  if (!movies.some(movie => movie.id === id2)) {
    rl.close();
    throw new Error(`Movie with ID ${id2} not found`);
  }

  // Close readline interface
  rl.close();

  return { id1, id2 };
}

async function main() {
  // Display a nice header
  console.log('\n==========================');
  console.log('    MOVIE SWAP TOOL');
  console.log('==========================\n');

  // Read the movies file
  const movies = readMoviesFile();

  // Display the movie list
  displayMovieList(movies);

  try {
    // Prompt for movie IDs
    const { id1, id2 } = await promptForMovieIds(movies);

    // Swap the movies
    const result = swapMovies(movies, id1, id2);

    if (result.success) {
      // Write the updated movies file
      if (writeMoviesFile(movies)) {
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
