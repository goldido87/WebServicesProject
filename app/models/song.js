// app/models/song.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SongSchema   = new Schema({
	author : String,
	title: String,
	embedUrl: String,
	likes: 0,
});

module.exports = mongoose.model('Song', SongSchema);