// Include express as a basic webserver
var express = require('express');
var app = express();
// parsing forms
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
// mongoose stuff
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bookDepository', { useMongoClient: true });
mongoose.Promise = global.Promise;

var Books = require('./models/books.js');

// Basic templating system taken from express docs http://expressjs.com/en/advanced/developing-template-engines.html
var fs = require('fs') // this engine requires the fs module
app.engine('ntl', function (filePath, options, callback) { // define the template engine
	fs.readFile(filePath, function (err, content) {
		if (err) return callback(err)
		// this is an extremely simple template engine
		var rendered = content.toString().replace('#html#', options.html).replace('#summary#', options.summary);//.replace('#list#', options.list).replace('#all_lists#', options.all_lists);
		return callback(null, rendered)
	})
})
app.set('views', './views') // specify the views directory
app.set('view engine', 'ntl') // register the template engine



// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 
// Set up static file serving (For css etc)
app.use(express.static('public'));


app.get("/",function(req,res){
	console.log('Attempting to List books');
	Books.find((err, books) => {  
		//Read
	    if (err) {
	        console.log("Can not fetch any books");
	    } else {
	    	var html = '';
	        // send the list of all the books
	        if(books.length) {
		        books.forEach( function(book) {
		        	var genre_html = '';
		        	var status_html = '';

		        	if(book.available) {
		        		status_html = "<a href=\"/changestatus?isbn="+book.isbn+"&status=0\" title=\"Change Status\"><i class=\"material-icons green-text\">assignment_returned</i></a>";
		        	} else {
		        		status_html = "<a href=\"/changestatus?isbn="+book.isbn+"&status=1\" title=\"Change Status\"><i class=\"material-icons red-text\">assignment_return</i></a>";
		        	}
		        	book.genre.forEach(function(gen) {
		        		genre_html += "<div class=\"chip\">"+gen+"</div> ";
		        	});
		        	html += "<tr><td>"+book.title+"</td><td>"+book.author+"</td><td>"+book.isbn+"</td>"
		        		  + "<td>"+genre_html+"</td><td>"+status_html
		        		  +	"<a href=\"/delete?isbn="+book.isbn+"\" title=\"Delete Book\"><i class=\"material-icons red-text\">delete</i></a></td></tr>";
		        });
		    } else {
		    	html += "<tr><td colspan=\"5\">No Books Found</td></tr>";
		    }

		    // Build a mapreduce to calculate number of books in collection
		    var mapRed = {};
		    mapRed.map = function() {
		    	this.genre.forEach(function(genre) {
		    		var key = genre;
		    		var value = 1;
		    		emit(key, value);
		    	});
		    }
		    mapRed.reduce = function(genre, count) {
		    	return count.length;
		    }

		    Books.mapReduce(mapRed, function (err, results) {
		    	var summaryHTML = "<strong>Genre Breakdown</strong>";
  				results.forEach(function(result) {
  					summaryHTML+= "<br />" + result._id+": "+result.value;
  				});
  				res.render('list', { "html": html, "summary":summaryHTML });
			});		
	    }
	});
});
	//Update
app.get("/changestatus", function(req,res) {
	// check in or check out book
	var isbn = req.query.isbn;
	var status = req.query.status;
	if(status == 1) {
		status = true;
	} else {
		status = false;
	}
	Books.findOneAndUpdate({ isbn: isbn }, {$set: {available: status}}, function (err, books){
		if (err) throw err;

	  console.log('Updated');
	  res.redirect('/');
	});

});

app.get('/delete', function(req, res) {
	var isbn = req.query.isbn;
	console.log(isbn);
	Books.remove({ isbn: isbn }, function (err) {
	  if (err) return handleError(err);

	  console.log('Removed');
	  res.redirect('/');
	  // removed!
	});
});

app.post('/insert', function(req, res) {
	// add a book
	var title = req.body.title;
	var author = req.body.author;
	var isbn = req.body.isbn;
	var genre = req.body.genre.split(',');

	var newBook = Books({
		"title": title,
		"author": author,
		"isbn": isbn,
		"genre": genre,
		"available": true
	});
	console.log(newBook);

	//save the book in the collection
	newBook.save(function(err){
		if (err) throw err;

		console.log('A new book has been created');
		res.redirect('/');
	});
})

// Listen on port 3000, view app with http://localhost:3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000! http://localhost:3000')
})