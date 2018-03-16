var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bookDepository', { useMongoClient: true });
mongoose.Promise = global.Promise;

var Books = require('../models/books.js');

// No query passed in means "find everything in the collection"
Books.find((err, books) => {  
    if (err) {
        console.log("Can not fetch any books");
    } else {
        // send the list of all the books
        console.log(books);
    }
});

// If query IS passed into .find(), filters by the query parameters
Books.find({"title": "Alice In Wonderland"}, (err, books) =>{  
    if (err) {
        console.log("Can not find book");
    } else {
        // send the list of all books in database with name of "Alice In Wonderland"
        // Very possible this will be an array with just one Book object in it.
        console.log(books);
    }
});