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

// set our port
var port = process.env.PORT || 8080;
// connect to our database
mongoose.connect('mongodb://sge:sge123654@ds037827.mongolab.com:37827/musicplayer'); 

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

	// create a song (accessed at POST http://localhost:8080/songs)
	.post(function(req, res) {

			var songToInsert = new Song();				// create a new instance of the Song model
			songToInsert.author = req.body.author;		// set the songs author (comes from the request)
			songToInsert.title = req.body.title;		// set the songs title (comes from the request)
			songToInsert.embedUrl = req.body.embedUrl;	// set the songs embedUrl (comes from the request)
			songToInsert.likes = parseInt(req.body.likes);		// set the songs likes (comes from the request)
			songToInsert.viewCount = parseInt(req.body.viewCount);
			songToInsert.category = req.body.category.toLowerCase();
			
			// save the song and check for errors
			songToInsert.save(function(err) {
				if (err)
					res.send(405,err);

				res.json(songToInsert);
			});

		})

	// get all the songs (accessed at GET http://localhost:8080/songs)
	.get(function(req, res) {
		Song.find().sort('field -likes').execFind(function(err, songs) {
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

	// update the song with this id (accessed at PUT http://localhost:8080/songs/:song_id)
	.put(function(req, res) {

		// use our song model to find the song we want
		Song.findById(req.params.song_id, function(err, song) {

			if (err)
				res.send(err);

			 song.viewCount = parseInt(req.body.viewCount);

			// save the song
			song.save(function(err) {
				if (err)
					res.send(err);

				res.json({ id : req.params.song_id,  msg : "Updated", views: song.viewCount});
			});

		});
	})

	// delete the song with this id (accessed at DELETE http://localhost:8080/songs/:song_id)
	.delete(function(req, res) {
		Song.remove({
			_id: req.params.song_id
		}, function(err, song) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// on routes that end in /songs/likes/:song_id
router.route('/songs/likes/:song_id')
// UPDATE Likes of song
	.put(function(req, res) {

		// use our song model to find the song we want
		Song.findById(req.params.song_id, function(err, song) {

			if (err)
				res.send(err);

			song.likes++;	// update the songs info

			// save the song
			song.save(function(err) {
				if (err)
					res.send(err);

				res.json({ newLikesCount: song.likes , id: song.embedUrl });
			});

		});
	})

// on routes that end in /songs/category/:categoryId
// ----------------------------------------------------
router.route('/songs/category/:category')
	.get(function(req, res)
	 {
		Song.find().where('category', req.params.category.toLowerCase()).sort('field -likes').execFind(function(err, songs) {
			if (err)
				res.send(err);

			res.json(songs);
		});
	});


// on routes that end in /
// ----------------------------------------------------
router.route('/search/songs/:category?')
	.get(function(req, res) {
			console.log(req.query['likesCondition']);
			console.log(req.query['likes']);
			console.log(req.params.category);
			
			var condition = req.query['likesCondition'].toLowerCase();
			var numOfLikes = req.query['likes'];
			var category = req.params.category;

			if(category == undefined)
			{	
				if(condition == 'gte')
					Song.find().where('likes').gte(numOfLikes).sort('field -likes').execFind(function(err, songs) {
				
					if (err)
						res.send(err);

					res.json(songs);
				});

				else if(condition == 'lte')
					Song.find().where('likes').lte(numOfLikes).sort('field -likes').execFind(function(err, songs) {
				
					if (err)
						res.send(err);

					res.json(songs);
				});
			}

			else
			{
				if(condition == 'gte')
					Song.find().where('category',category).where('likes').gte(numOfLikes).sort('field -likes').execFind(function(err, songs) {
				
					if (err)
						res.send(err);

					res.json(songs);
				});

				else if(condition == 'lte')
					Song.find().where('likes').where('category',category).lte(numOfLikes).sort('field -likes').execFind(function(err, songs) {
				
					if (err)
						res.send(err);

					res.json(songs);
				});
			}


		});

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);
app.use('/', express.static(__dirname + '/public'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);