#!/usr/bin/env node
/**
 * MAL OAuth Token Generator
 *
 * This script helps you get new MAL access and refresh tokens.
 *
 * Usage:
 *   1. Run: node scripts/mal-auth.js
 *   2. Open the URL it prints in your browser
 *   3. Authorize the app on MyAnimeList
 *   4. Copy the 'code' parameter from the redirect URL
 *   5. Run: node scripts/mal-auth.js <code>
 *   6. Your .env.local will be updated with new tokens
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
  console.error('Could not read .env.local file');
  process.exit(1);
}

// Parse env file
function parseEnv(content) {
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1]] = match[2];
    }
  });
  return env;
}

const env = parseEnv(envContent);
const CLIENT_ID = env.MAL_CLIENT_ID;
const CLIENT_SECRET = env.MAL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('MAL_CLIENT_ID and MAL_CLIENT_SECRET must be set in .env.local');
  process.exit(1);
}

// Generate PKCE code verifier and challenge
// MAL uses "plain" method - challenge equals verifier
function generateCodeVerifier() {
  // MAL requires 43-128 character verifier
  return crypto.randomBytes(64).toString('base64url').substring(0, 128);
}

function generateCodeChallenge(verifier) {
  // MAL uses plain method, not S256
  return verifier;
}

// Store code verifier in a temp file for step 2
const verifierPath = path.join(__dirname, '.mal-code-verifier');

// Make HTTPS request
function httpsRequest(url, options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// Update .env.local with new tokens
function updateEnvFile(accessToken, refreshToken) {
  let content = envContent;

  // Update or add MAL_ACCESS_TOKEN
  if (content.includes('MAL_ACCESS_TOKEN=')) {
    content = content.replace(/MAL_ACCESS_TOKEN=.*/g, `MAL_ACCESS_TOKEN=${accessToken}`);
  } else {
    content += `\nMAL_ACCESS_TOKEN=${accessToken}`;
  }

  // Update or add MAL_REFRESH_TOKEN
  if (content.includes('MAL_REFRESH_TOKEN=')) {
    content = content.replace(/MAL_REFRESH_TOKEN=.*/g, `MAL_REFRESH_TOKEN=${refreshToken}`);
  } else {
    content += `\nMAL_REFRESH_TOKEN=${refreshToken}`;
  }

  fs.writeFileSync(envPath, content);
  console.log('\n✅ Updated .env.local with new tokens!');
}

async function exchangeCodeForTokens(code, codeVerifier) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    code_verifier: codeVerifier,
  });

  const response = await httpsRequest(
    'https://myanimelist.net/v1/oauth2/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
    params.toString()
  );

  return response;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Step 1: Generate auth URL
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Save verifier for step 2
    fs.writeFileSync(verifierPath, codeVerifier);

    const authUrl = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeChallenge}`;

    console.log('\n🔐 MAL OAuth Token Generator\n');
    console.log('Step 1: Open this URL in your browser:\n');
    console.log(authUrl);
    console.log('\nStep 2: After authorizing, you\'ll be redirected to a URL like:');
    console.log('  https://your-redirect-url.com/?code=XXXXXX\n');
    console.log('Step 3: Copy the code value and run:');
    console.log('  node scripts/mal-auth.js XXXXXX\n');

  } else {
    // Step 2: Exchange code for tokens
    const code = args[0];

    // Load saved verifier
    let codeVerifier;
    try {
      codeVerifier = fs.readFileSync(verifierPath, 'utf-8');
    } catch (e) {
      console.error('Could not find code verifier. Please run step 1 first.');
      process.exit(1);
    }

    console.log('\n🔄 Exchanging authorization code for tokens...\n');

    const response = await exchangeCodeForTokens(code, codeVerifier);

    if (response.status !== 200) {
      console.error('❌ Failed to exchange code for tokens:');
      console.error(response.data);
      process.exit(1);
    }

    const { access_token, refresh_token, expires_in } = response.data;

    console.log('✅ Successfully obtained tokens!\n');
    console.log(`Access Token (first 50 chars): ${access_token.substring(0, 50)}...`);
    console.log(`Refresh Token (first 50 chars): ${refresh_token.substring(0, 50)}...`);
    console.log(`Expires in: ${expires_in} seconds (~${Math.round(expires_in / 86400)} days)\n`);

    // Update .env.local
    updateEnvFile(access_token, refresh_token);

    // Clean up verifier file
    try {
      fs.unlinkSync(verifierPath);
    } catch (e) {}

    console.log('\n🎉 Done! Restart your dev server to use the new tokens.');
  }
}

main().catch(console.error);
