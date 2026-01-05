const mongoose = require('mongoose');

// Define how a To-Do task is stored
const TodoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Todo', TodoSchema);
