const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('./userModel');

const KEYCLOAK_BASE_URL = 'https://keycloak.dynapix.in';
const REALM = 'elite-player';
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;

exports.loginUser = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Login and password are required' });
  }

  try {
    const tokenUrl = `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('username', login);
    params.append('password', password);
    params.append('scope', 'openid');

    const tokenResponse = await axios.post(tokenUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const accessToken = tokenResponse.data.access_token;
    const decodedToken = jwt.decode(accessToken);

    if (!decodedToken) {
      return res.status(400).json({ message: 'Email not found in access token' });
    }

    const email = decodedToken.email;

    const user = await User.findOne({ primaryEmail: email });

    if (!user) {
      console.log('[MongoDB] User not found');
      return res.status(404).json({ message: 'User not found in database' });
    }

    user.keycloakToken = accessToken;
    await user.save();

    console.log('[MongoDB] User found:', {
      id: user._id,
      userName: user.userName,
      email: user.primaryEmail,
    });

    return res.status(200).json({
      message: 'Login successful',
      user,
      token: accessToken,
    });

  } catch (error) {
    console.error('[Login Error]', error.response?.data || error.message);
    return res.status(401).json({
      message: 'Login failed',
      error: error.response?.data || error.message,
    });
  }
};
