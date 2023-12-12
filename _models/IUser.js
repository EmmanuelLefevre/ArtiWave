/*============ IMPORT USED MODULES ============*/
const mongoose = require('mongoose');


/*============ USER MODELE ============*/
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	pseudo: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	registeredAt: {
		type: Date,
        required: true,
		default: Date.now,
		immutable: true
	}
});

const User = mongoose.model('User', userSchema);


/*============ EXPORT MODULE ============*/
module.exports = User;
