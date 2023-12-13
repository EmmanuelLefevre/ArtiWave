/*============ IMPORT USED MODULES ============*/
const mongoose = require('mongoose');


/*============ USER MODELE ============*/
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	nickname: {
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
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	}
});

const User = mongoose.model('User', userSchema);


/*============ EXPORT MODULE ============*/
module.exports = User;
