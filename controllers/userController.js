const { User } = require('../models');

module.exports = {
    // get all users
    getUsers(req,res){
        User.find()
        .select('-__v')
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },

    // get single user
    getSingleUser(req,res){
        User.findOne({ _id: req.params.userId })
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // create a user
    createUser(req,res){
        User.create(req.body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(500).json(err));
    },

    // update a user
    updateUser(req,res){
        User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, {new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData){
                    res.status(404).json({ message: 'No user found with that ID' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err))
    },

    // to delete a user
    deleteUser(req,res){
        User.findOneAndDelete({ _id: req.params.userId })
        .then((dbUserData) => {
            if (!dbUserData){
                res.status(404).json({ message: 'No user found with that ID' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    },

    // add a friend
    addFriend({params}, res){
        User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId }}, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'No user found with that ID' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // delete a friend
    deleteFriend({params}, res){
        User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId }}, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'No user found with that ID' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    }
}