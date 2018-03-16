var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bookDepository', { useMongoClient: true });
mongoose.Promise = global.Promise;

var Books = require('../models/books.js');

Books.remove({ title: 'Alice through the Looking Glass' }, function (err) {
  if (err) return handleError(err);

  console.log('Removed');
  // removed!
});