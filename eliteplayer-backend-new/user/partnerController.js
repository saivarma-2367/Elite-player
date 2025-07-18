const Partner = require('../user/partnerModel');
const User = require('../user/userModel');

const createPartner = async (req, res) => {
  const { initiatedBy, joinedBy, createdBy } = req.body;

  if (!initiatedBy || !joinedBy || !Array.isArray(joinedBy) || joinedBy.length < 1) {
    return res.status(400).json({ error: 'Initiator and at least one joined user are required.' });
  }

  const allUserIds = [initiatedBy, ...joinedBy];
  const uniqueUserIds = [...new Set(allUserIds.map(String))];
  if (uniqueUserIds.length !== allUserIds.length) {
    return res.status(400).json({ error: 'Duplicate user IDs are not allowed.' });
  }

  try {
    const userDocs = await User.find({ _id: { $in: allUserIds } });

    if (userDocs.length !== allUserIds.length) {
      return res.status(400).json({ error: 'Some user IDs are invalid.' });
    }

   const mapUser = (user) => ({
  id: user._id.toString(),
  name: user.userName,
  membershipValidTill: user.subscriptionPlan?.[0]?.subscriptionEnding,
  email:user.primaryEmail,
});



    const userMap = new Map(userDocs.map(user => [user._id.toString(), mapUser(user)]));

    const initiatedByUser = userMap.get(initiatedBy);
    const joinedByUsers = joinedBy.map(id => userMap.get(id)).filter(Boolean);

    const partner = new Partner({
      initiatedBy: initiatedByUser,
      acceptedBy: joinedByUsers,
      createdBy,
      status: 'active',
    });

    await partner.save();

    res.status(201).json({
      message: 'Partner created successfully',
      partner,
    });
  } catch (err) {
    console.error('Error creating partner:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

module.exports = { createPartner };
