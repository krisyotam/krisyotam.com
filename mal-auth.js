const express = require('express');
const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

const CLIENT_ID = 'dd2c9b169250a0e03c89fbf4bc0f498d';
const CLIENT_SECRET = 'e80ded9c267674532fe8c4668b6f04ef7d6ecfc95d7ea1754e4072df4d6c57ea';
const REDIRECT_URI = 'http://localhost:8080/callback';
const PORT = 8080;

const app = express();

// PKCE with `plain` method: code_challenge === code_verifier
const codeVerifier = crypto.randomBytes(64).toString('base64url');
const codeChallenge = codeVerifier;

const open = (...args) => import('open').then(mod => mod.default(...args));

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('❌ Authorization code not found.');
  }

  try {
    const response = await axios.post(
      'https://myanimelist.net/v1/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, refresh_token, expires_in, token_type } = response.data;

    const output = {
      access_token,
      refresh_token,
      expires_in,
      token_type,
      obtained_at: Math.floor(Date.now() / 1000)
    };

    fs.writeFileSync('tokens.txt', JSON.stringify(output, null, 2), 'utf8');

    res.send('✅ MyAnimeList tokens saved to tokens.txt. You may close this window.');
    console.log('✅ Tokens received and saved to tokens.txt');
    server.close();
  } catch (err) {
    console.error('❌ Error exchanging code for token:', err.response?.data || err.message);
    res.status(500).send('Failed to exchange code for tokens.');
  }
});

const server = app.listen(PORT, async () => {
  const authUrl = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&code_challenge=${codeChallenge}&code_challenge_method=plain`;

  console.log('🔗 Opening browser for MyAnimeList login...');
  await open(authUrl);
});
