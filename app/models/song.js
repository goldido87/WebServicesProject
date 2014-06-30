// app/models/song.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SongSchema   = new Schema({
	author : String,
	title: String,
	viewCount: Number,
	embedUrl: { type:String, unique: true },
	likes: Number,
	category: String,
});

module.exports = mongoose.model('Song', SongSchema);