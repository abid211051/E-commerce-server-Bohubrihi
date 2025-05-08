const _ = require("lodash");
const { Profile } = require("../models/profile");

module.exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).send("Profile Not Found");
    return res.status(200).send(profile);
  } catch (error) {
    return res.status(500).send({
      error: error.message,
      message: "Something went wrong",
    });
  }
};

module.exports.setProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProfile = _.pick(req.body, [
      "phone",
      "address1",
      "address2",
      "city",
      "state",
      "postcode",
      "country",
    ]);
    userProfile["user"] = userId;
    let profile = await Profile.findOne({ user: userId });
    if (profile) {
      await Profile.updateOne({ user: userId }, userProfile);
    } else {
      profile = new Profile(userProfile);
      await profile.save();
    }
    return res.status(200).send("Updated Successfully!");
  } catch (error) {
    return res.status(500).send({
      error: error.message,
      message: "Something went wrong",
    });
  }
};
