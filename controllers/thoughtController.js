const { Thought, User } = require('../models');

module.exports = {
//    get all thoughts
    getThoughts(req,res){
        Thought.find()
        .select('-__v')
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.status(500).json(err));
    },

    // get single thought by id
    getSingleThought(req,res)

    // create new thought

    // update a thought by id

    // delete a thought by id
}