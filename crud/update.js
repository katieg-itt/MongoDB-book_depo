var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bookDepository', { useMongoClient: true });
mongoose.Promise = global.Promise;

var Books = require('../models/books.js');

/*Books.find({title: 'Alice In Wonderland'}, function(err, books){
	if (err) throw err;

	books.author = 'John Snow';

	Books.save(function(err){
		if (err) throw err;

		console.log('The book has been successfully updated');
	})

});**/

//To update an easier way using the mongodb findAndModify command
var query = {title: 'Alice In Wonderland'};
Books.findOneAndUpdate(query, {$set: {title: 'Alice through the Looking Glass'}}, function (err, books){
	if (err) throw err;

	//returning the updated book 
	console.log(books);
});

