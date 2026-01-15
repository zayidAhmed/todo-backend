const mongoose = require('mongoose');

// Define how a user will be stored in the database
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Export the model so other files can use it
module.exports = mongoose.model('User', UserSchema);
