// app/models/song.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SongSchema   = new Schema({
	author : String,
	title: String,
	viewCount: { type :Number, default: 0 },
	embedUrl: { type:String, unique: true },
	likes: { type :Number, default: 0 },
	category: String,
});

module.exports = mongoose.model('Song', SongSchema);