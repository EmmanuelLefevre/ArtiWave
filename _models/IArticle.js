/*============ IMPORT USED MODULES ============*/
const mongoose = require('mongoose');
const { Schema } = require('mongoose');


/*============ USER MODELE ============*/
const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
        immutable: true
	},
    createdAt: {
        type: Date,
        required: true,
		default: Date.now,
        immutable: true
    }
});

// Creating compound index on title && author properties
articleSchema.index({ title: -1, author: 1 }, { unique: true });

const Article = mongoose.model('Article', articleSchema);


/*============ EXPORT MODULE ============*/
module.exports = Article;