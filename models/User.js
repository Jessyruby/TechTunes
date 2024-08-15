const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    passwordConfirm: String,
});

const User = mongoose.model('Usuarios', UserSchema);

module.exports = User