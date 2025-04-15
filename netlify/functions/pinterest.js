const axios = require('axios');

exports.handler = async (event) => {
  // 1. Authorization Code feldolgozása
  const { code } = event.queryStringParameters;
  
  if (!code) {
    return { statusCode: 400, body: "Missing authorization code" };
  }

  // 2. Token kérés a Pinterest API-tól
  try {
    const response = await axios.post('https://api.pinterest.com/v5/oauth/token', {
      client_id: process.env.PINTEREST_APP_ID,
      client_secret: process.env.PINTEREST_APP_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `https://${process.env.URL}/.netlify/functions/pinterest`
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    // 3. Sikeres válasz
    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        expires_in: response.data.expires_in
      })
    };
    
  } catch (error) {
    // 4. Hiba kezelése
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: "Failed to authenticate",
        details: error.response?.data || error.message
      })
    };
  }
};