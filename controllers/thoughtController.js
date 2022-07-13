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
    getSingleThought(req,res){
        Thought.findOne({ _id: req.params.thoughtId })
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
    },

    // create new thought
    createThought({body},res){
        Thought.create(body)
        .then(dbThoughtData => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            )
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'There is no user with that ID' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    // update a thought by id
    updateThought(req,res){
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
            res.json(dbThoughtData);
        })         
        .catch(err => res.json(err))
        },
    
    // delete a thought by id
    deleteThought(req,res){
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },

     // create a reaction
    createReaction({params}, res){
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reactions: body }}, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
     
    // delete a reaction
    deleteReaction({params}, res){
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: { reactionId: params.reactionId }}}, { new: true })
        .then(dbThoughtData => {
            if (!dbThoughtData){
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    }
}
