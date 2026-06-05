import User from "../models/user.model.js";

const userRepository = {
  findByEmail: async (email, selectFields = {}) => {
    return await User.findOne({ email }).select(selectFields);
  },

  createUser: async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
  },
  updateById: async (id, updateDate, options = {}) => {
    const defaultOptions = {
      returnDocument: "after",
      runValidators: true,
    };

    return await User.findByIdAndUpdate(id, updateDate, {
      ...defaultOptions,
      ...options,
    });
  },
};

export default userRepository;
