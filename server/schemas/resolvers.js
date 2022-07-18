const {User} = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const {signToken} = require('../utils/auth'); 

//made based on the user-controller file
const resolvers = {
// getMe(logged In user), getSingleUser by username, getAllUsers
 Query: {
    me: async(parent,args, context) => {
        if(context.user) {
            const userData = await User.findOne({_id: context.user._id})
                .select('-__v -password')

                return userData;
        }
        throw new AuthenticationError('You need to be logged in!')
    },

    user: async(parent, {username}, context) => {
        if(context.user){
            const userData = await User.findOne({username})
                .select('-__v -password')
                .populate('savedBooks')

                return userData;
        }
        throw new AuthenticationError('You need to be logged in!')
    },

    users: async()=>{
        return User.find()
            .select('-__v -password')
            .populate('savedBooks')
    }
 },
    //create a user, login, save book to a user, remove a book from a user
 Mutation: {
    createUser: async(parent,args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return {token, user};
    },

    login: async(parent, {email, password}) => {
        const user = await User.findOne({email});

        if(!user) {
            throw new AuthenticationError('You need to enter a valid email or signup!')
        }

        const correctPw = await user.isCorrectPassword(password);

        if(!correctPw) {
            throw new AuthenticationError('You need to enter a valid password!');
        }

        const token = signToken(user);
        return {token, user};
    },

    saveBook: async(parent,args, context) => {
        if(context.user){
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$push: {savedBooks: args.bookData}},
                {new: true}
            )
            return updatedUser;
        }
        throw new AuthenticationError('You need to log in first');
    },

    removeBook: async(parent, args, context) => {
        if(context.user){
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$pull: {savedBooks: args.bookId}},
                {new: true}
            )
            return updatedUser;
        }
        throw new AuthenticationError('You need to log in first');
    }
 }
};

module.exports = resolvers;