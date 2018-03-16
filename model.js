var mongoose = require('mongoose');

var Schema = mongoose.Schema;

	var bookSchema = new Schema({
		title: String,
		author: String,
		isbn: Number,
		genre: [String],
		available: true
});

	//The schema is useless until a model is created
	var Books = mongoose.model('Books',bookSchema);

	//make this availble to users in the Node application
	module.exports = Books;