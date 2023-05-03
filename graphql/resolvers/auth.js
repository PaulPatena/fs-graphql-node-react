const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const { getUserById } = require('./common');

module.exports = {
  user: async args => {
    try {
      const user = await getUserById(args.userId);
      return user;
    } catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    try {
      // Note: always return a PROMISE in your mutation
      const user = await User.findOne({email: args.userInput.email})

      // Note: mongoose will always take u to then block whether you found a user or not
      //  (catch is only for db-connection errors). user will be undefined if not found
      if (user) {
          throw new Error(`User ${args.userInput.email} already exists`);
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await newUser.save();

      return {...result._doc, password: null};
    } catch (err) {
      throw err;
    }
  }
};
