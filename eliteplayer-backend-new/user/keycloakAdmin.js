const axios = require('axios');
require('dotenv').config();

const KEYCLOAK_BASE_URL = 'https://keycloak.dynapix.in';
const REALM = 'elite-player';
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;
const ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD;

async function getAdminToken() {
  const tokenUrl = `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('username', ADMIN_USERNAME);
  params.append('password', ADMIN_PASSWORD);
  params.append('scope', 'openid');

  const response = await axios.post(tokenUrl, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
}

async function createUser(accessToken, userData) {
  const createUserUrl = `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users`;

  const payload = {
    username: userData.username,
    email: userData.email,
    enabled: true,
    emailVerified: true,
    firstName: userData.firstName || 'First',
    lastName: userData.lastName || 'Last',
    credentials: [
      {
        type: 'password',
        value: userData.password,
        temporary: false,
      },
    ],
    requiredActions: [],
  };

  const response = await axios.post(createUserUrl, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response;
}

async function getUserAccessToken(username, password) {
  const tokenUrl = `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('username', username);
  params.append('password', password);
  params.append('scope', 'openid');

  const response = await axios.post(tokenUrl, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
}

module.exports = {
  getAdminToken,
  createUser,
  getUserAccessToken,
};
