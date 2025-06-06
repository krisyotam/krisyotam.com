const fs = require('fs').promises;
const path = require('path');

async function main() {
    // Read the categories and poems data
    const categoriesData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/verse/categories.json'), 'utf8'));
    const poemsData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/verse/poems.json'), 'utf8'));

    // Create the base content directory if it doesn't exist
    const contentBasePath = path.join(__dirname, '../app/verse/content');
    await fs.mkdir(contentBasePath, { recursive: true });

    // Create directories for each category type
    for (const type of categoriesData.types) {
        const typePath = path.join(contentBasePath, type.slug);
        try {
            await fs.access(typePath);
            console.log(`Directory already exists: ${type.slug}`);
        } catch {
            await fs.mkdir(typePath);
            console.log(`Created directory: ${type.slug}`);
        }
    }

    // Process each poem
    for (const poem of poemsData) {
        const typeDir = path.join(contentBasePath, poem.type);
        const poemPath = path.join(typeDir, `${poem.slug}.mdx`);

        // Skip if the poem file already exists
        try {
            await fs.access(poemPath);
            console.log(`Poem already exists: ${poem.slug}`);
            continue;
        } catch {
            // File doesn't exist, continue processing
        }

        // Build the content from stanzas
        let content = '';
        let stanzaNum = 1;
        while (poem[`stanza${stanzaNum}`]) {
            content += poem[`stanza${stanzaNum}`] + '\n\n';
            stanzaNum++;
        }

        // Write the poem file
        await fs.writeFile(poemPath, content.trim());
        console.log(`Created poem: ${poem.slug}`);
    }
}

main().catch(console.error);
