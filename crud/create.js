var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bookDepository', { useMongoClient: true });
mongoose.Promise = global.Promise;

var Books = require('../models/books.js');

//create a new book
var newBook = Books({
	title: "Alice In Wonderland",
	author: "David Walliams",
	isbn: "123456",
	genre: ["fiction", "adventure", "children"],
	available: true
});

//save the book in the collection
newBook.save(function(err){
	if (err) throw err;

	console.log('A new book has been created');
});