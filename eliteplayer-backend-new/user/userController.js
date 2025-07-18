const User = require('./userModel');
const { getAdminToken, createUser, getUserAccessToken } = require('./keycloakAdmin');

exports.registerUser = async (req, res) => {
  console.log('✅ [Checkpoint] Starting user registration');
  console.log('📦 Incoming data:', req.body);

  try {
    const {
      userName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      address,
      latitude,
      longitude,
      primaryEmail,
      secondaryEmail,
      referalId,
      userType,
      sport,
      subscriptionPlan,
      rating,
      clubId,
      gender,
      role,
      password,
    } = req.body;

    if (!userName || !primaryEmail || !password || !gender || !userType || !primaryPhoneNumber || !address || !sport || !clubId) {
      console.error('[Error] Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const accessToken = await getAdminToken();

    const keycloakUser = {
      username: userName,
      email: primaryEmail,
      password,
      firstName: userName,
      lastName: 'Player',
    };

    await createUser(accessToken, keycloakUser);
    console.log('[Success] User registered in Keycloak');

    const newUser = new User({
      userName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      address,
      latitude,
      longitude,
      primaryEmail,
      secondaryEmail,
      referalId,
      userType,
      sport,
      subscriptionPlan,
      rating,
      clubId,
      gender,
      role,
      isOnHold: { status: false, onHoldMessage: '' },
      keycloakToken: accessToken,
    });

    const savedUser = await newUser.save();
    console.log('✅ [Success] User saved to MongoDB');

    res.status(201).json({
      message: 'User registered successfully',
      user: savedUser,
    });
  } catch (error) {
    console.error('[Error] Failed to register user:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    const accessToken = await getUserAccessToken(username, password);
    console.log('✅ [Keycloak] Token fetched:', accessToken);

    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    console.log('✅ [MongoDB] User fetched:', user);

    res.status(200).json({
      message: 'Login successful',
      token: accessToken,
      user,
    });
  } catch (error) {
    console.error('[Login Error]', error?.response?.data || error.message);
    res.status(401).json({ message: 'Login failed', error: error.message });
  }
};
