/*============ IMPORT USED MODULES ============*/
const mongoose = require('mongoose');


/*============ USER MODELE ============*/
const userSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		default: () => new mongoose.Types.ObjectId()
	},
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
	},
	roles: {
		type: String,
		required: true,
		enum: ['admin', 'certified', 'user'],
		default: 'user'
	}
});

const User = mongoose.model('User', userSchema);


/*============ EXPORT MODULE ============*/
module.exports = User;
