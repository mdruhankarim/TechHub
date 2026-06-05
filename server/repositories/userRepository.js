import User from "../models/user.model.js";

const userRepository = {
  findByEmail: async (email) => {
    return await User.findOne({ email });
  },

  createUser: async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
  },
};

export default userRepository;
