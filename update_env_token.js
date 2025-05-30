const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

// GraphQL API endpoint
const GRAPHQL_ENDPOINT = 'https://literal.club/graphql/';

// Credentials
const email = 'krisyotam@protonmail.com';
const password = 'Sasuke99!!';

async function getToken(email, password) {
  try {
    const query = `
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `;

    const variables = { email, password };

    let fetch;
    fetch = (await import('node-fetch')).default;

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors.map((err) => err.message).join(', '));
    }

    const token = json.data.login.token;
    console.log('\n✅ NEXT_PUBLIC_LITERAL_TOKEN:\n', token, '\n');

    // Update .env.local file
    const envPath = '.env.local';
    const envContent = fs.readFileSync(envPath, 'utf8');
    const updatedEnvContent = envContent.replace(/NEXT_PUBLIC_LITERAL_TOKEN=.*/g, `NEXT_PUBLIC_LITERAL_TOKEN=${token}`);
    fs.writeFileSync(envPath, updatedEnvContent, 'utf8');

    console.log('✅ .env.local updated successfully!');
  } catch (err) {
    console.error('❌ Error getting token:', err);
  }
}

getToken(email, password);
