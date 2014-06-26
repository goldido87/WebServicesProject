// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');		// call express
var app        = express();					// define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var fs = require('fs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080;		// set our port

mongoose.connect('mongodb://sge:sge123654@ds037827.mongolab.com:37827/musicplayer'); // connect to our database

var Song = require('./app/models/song');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// on routes that end in /songs
// ----------------------------------------------------
router.route('/songs')

	// create a song (accessed at POST http://localhost:8080/api/songs)
	.post(function(req, res) {
		
		var song = new Song();			// create a new instance of the Song model
		song.author = req.body.author;  // set the songs author (comes from the request)
		song.title = req.body.title;	// set the songs title (comes from the request)
		song.likes = req.body.likes;	// set the songs likes (comes from the request)

		// save the song and check for errors
		song.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Song created!' });
		});
		
	})

	// get all the songs (accessed at GET http://localhost:8080/api/songs)
	.get(function(req, res) {
		Song.find(function(err, songs) {
			if (err)
				res.send(err);

			res.json(songs);
		});
	});

// on routes that end in /songs/:song_id
// ----------------------------------------------------
router.route('/songs/:song_id')

	// get the song with that id (accessed at GET http://localhost:8080/api/songs/:song_id)
	.get(function(req, res) {
		Song.findById(req.params.song_id, function(err, song) {
			if (err)
				res.send(err);
			res.json(song);
		});
	})

	// update the song with this id (accessed at PUT http://localhost:8080/api/songs/:song_id)
	.put(function(req, res) {

		// use our song model to find the song we want
		Song.findById(req.params.song_id, function(err, song) {

			if (err)
				res.send(err);

			song.author = req.body.author;	// update the songs info
			song.title = req.body.title;	// update the songs info
			song.likes = req.body.likes;	// update the songs info

			// save the song
			song.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Song updated!' });
			});

		});
	})

	// delete the song with this id (accessed at DELETE http://localhost:8080/api/songs/:song_id)
	.delete(function(req, res) {
		Song.remove({
			_id: req.params.song_id
		}, function(err, song) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	    fs.readFile('index.html', function(err, page) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(page);
        res.end();
    });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);