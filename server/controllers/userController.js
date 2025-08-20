import User from '../models/userModel.js';


export const getUserData = async (req, res) => {
  try {
    console.log("Fetching user data...");
  // userId is attached by userAuth middleware as req.userId or req.user
  const userId = req.userId || req.user?.id || req.user?._id;
  console.log("User ID from middleware:", userId);
  const user = await User.findById(userId);
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({success:true, userData:{
        id:user._id,
        name:user.name,
        email:user.email,
        isAccountVerified:user.isAccountVerified
    }});
  } catch (error) {
    res.status(500).json({success:false, message: 'Server error' });
  }
};

