const club = require('./clubModel');
const { getAdminToken, createUser } = require('../user/keycloakAdmin');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const KEYCLOAK_BASE_URL = 'https://keycloak.dynapix.in';
const REALM = 'elite-player';
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;

exports.createClub = async (req, res) => {
  try {
    const {
      userName,
      spoc,
      email,
      membership,
      mobileNumber,
      referral,
      password,
      address,
    } = req.body;

    const newClub = new club({
      userName,
      spoc,
      address,
      email,
      membership,
      mobileNumber,
      referral,
    });

    const savedClub = await newClub.save();

    const accessToken = await getAdminToken();

    await createUser(accessToken, {
      username: email,
      email,
      password,
    });

    res.status(201).json({
      message: 'Club created and user registered in Keycloak',
      club: savedClub,
    });

  } catch (err) {
    console.error('[Error] Club creation failed:', err?.response?.data || err);
    res.status(500).json({
      message: 'Failed to create club or Keycloak user',
      error: err?.response?.data || err.message,
    });
  }
};

exports.loginClub = async (req, res) => {
  const { email, password } = req.body;

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('username', email);
    params.append('password', password);

    const tokenRes = await axios.post(
      `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const token = tokenRes.data.access_token;

    const decoded = jwt.decode(token);
    const userEmail = decoded?.email || decoded?.preferred_username;

    if (!userEmail) {
      return res.status(400).json({ message: 'Failed to extract user email from token' });
    }

    const clubData = await club.findOne({ email: userEmail });

    if (!clubData) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.status(200).json({
      message: 'Login successful',
      token,
      club: clubData,
    });

  } catch (err) {
    console.error('Login failed:', err?.response?.data || err);
    res.status(401).json({ message: 'Invalid credentials', error: err?.response?.data || err.message });
  }
};
