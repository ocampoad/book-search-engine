const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        getAllBooks: async () => {
            try {
                return Book.find();
            } catch (error) {
                throw new Error(error)
            }

        },

        getSingleBook: async (parent, { bookId }) => {
            try {
                return Book.findOne({ _id: bookId });
            } catch (error) {
                throw new Error(error)
            }

        },

        getAllUser: async () => {
            try {
                return User.find();
            } catch (error) {
                throw new Error(error)
            }

        },

        getSingleUser: async () => (parent, { userId }) => {
            try {
                return User.findOne({ _id: userId });
            } catch (error) {
                throw new Error(error)
            }

        },

    },

    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            try {
                const newUser = await User.create({ username, email, password });
                const token = signToken(newUser);
                return { token, newUser }
            } catch (error) {
                throw new Error(error)
            }
        },
        login: async (parent, { username, email, password }) => {
            try {
                const user = await User.findOne({ $or: [{ username: username }, { email: email }, { password: password }] })
                if (!user) {
                    return "Invalid credentials";
                }
                const correctPw = await user.isCorrectPassword(password);
                if (!correctPw) {
                    return "Invalid credentials";
                }
                const token = signToken(user);
                return { token, user }
            } catch (error) {
                throw new Error(error)
            }
        },
         saveBook: async (parent, {user, body}) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                  );
                  return updatedUser
            } catch (error) {
                throw new Error(error)
            }
         },
         deleteBook: async (parent, { user, params}) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: params.bookId } } },
                    { new: true }
                  );
                  if (!updatedUser) {
                    return "Couldn't find user with this id!";
                  }
                  return updatedUser;
            } catch (error) {
                throw new Error(error)
            }
         }
    }
};

module.exports = resolvers;