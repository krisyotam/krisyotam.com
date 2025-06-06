const fs = require('fs').promises;
const path = require('path');

async function main() {
    const poemsPath = path.join(__dirname, '../data/verse/poems.json');
    
    // Read the poems data
    const poemsData = JSON.parse(await fs.readFile(poemsPath, 'utf8'));
    
    // Process each poem
    const cleanedPoems = poemsData.map(poem => {
        // Create a new object with all properties except stanzas
        const cleanedPoem = {};
        for (const [key, value] of Object.entries(poem)) {
            if (!key.startsWith('stanza')) {
                cleanedPoem[key] = value;
            }
        }
        return cleanedPoem;
    });

    // Write back the cleaned data with proper formatting
    await fs.writeFile(
        poemsPath, 
        JSON.stringify(cleanedPoems, null, 2),
        'utf8'
    );

    console.log('Successfully removed all stanza content from poems.json');
}

main().catch(console.error);
