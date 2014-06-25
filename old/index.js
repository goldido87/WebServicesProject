var restify = require('restify');
var server = restify.createServer({ name : "restifysample" , "Content-Type" : 'html'});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

server.listen(1400 ,'127.0.0.1', function(){
 console.log('%s listening at %s ', server.name ,server.url);
});

server.use(restify.queryParser());
server.use(restify.bodyParser());

db.on('error', function(e) { console.log(e); });

db.once('open', function () {
	console.log("connected!");
});

//create an song schema for operation with mongo
var songSchema = mongoose.Schema(
    {
		songid: String,
		author : String,
		title: String,
		collection:'songs'
	}
);

// model reference
var songs = mongoose.model('songs', employeeSchema);


/**
*
*Create Song
**/
function createSong(songid, title, author, callback)
{
            var objLog = new songs();
           
            objLog.songid = songid;
            objLog.title = title;
            objLog.author = author;
             
            objLog.save(function (error, result) {
              callback(error, result);
            });
 }

/**
*
*Read Songs
**/
function readSong(callback)
{
            songs.find({},function (error, result) {
              callback(error, result);
            });
           
 }


/**
*
* Update Songs
**/
function updateSong(_id, title, author, callback)
{
            songs.findById(_id, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
                        item.updated = new Date();
            item.title = title;
            item.author = author;
                        item.save(function (err, result) {
                          callback(err, result);
                        });
              }
            });
 }

/**
*
* Delete Song
**/
function deleteSong(_id,callback)
{
            songs.findById(_id, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
                        songs.remove(item,function (err, result) {
                          callback(err, result);
                        });
              }
            });
 }