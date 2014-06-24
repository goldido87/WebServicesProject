var restify = require('restify');
var server = restify.createServer({ name : "restifysample" });

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
	var songSchema = mongoose.Schema({id:Number, name: String});
	songSchema.methods.printDetails = function() {
		var str = "id=" + this.id + " name="+this.name;
		console.log(str);
	};

	var Song = mongoose.model('Songs',songSchema);
	var u2 = new Song({id:1,name:'U2 - elevation'});
	var shakira = new Song({id:2,name:'shakira - waka waka'});
	 
	u2.save(function(error,prod) {
		if(error) {
			console.log(error);
		}
		else {
			console.log("u2 was saved to mongodb");
			u2.printDetails();
		}
	});

	shakira.save(function(error,prod) {
		if(error) {
			console.log(error);
		}
		else {
			console.log("shakira was saved to mongodb");
			shakira.printDetails();
		}
	});

	Song.find(function(error,songs) {
		if(error) {
			console.log(error);
		}
		else {
			console.log(songs);
		}
	});


	/////////////////////////
	//   REST Functions   //
	///////////////////////


	function findSong(req,res,next)
	{
	 console.log("inside findSong(req,res,next) req.params.songid="+req.params.songid);
	 var id = req.params.songid;
	 //fetching data from db
	 //...
	 if(id==1)
	 {
	 res.send(200, u2);
	 return next();
	 }
	}

	function findSongs(req,res,next)
	{
	 console.log("inside findSong(req,res,next) req.params.songid="+req.params.songid);
	 //fetching data from db



	 //...
	 res.send(200, {'id':1,'name':'danidin','average':98});
	 return next();
	}



	/////////////////////////
	//     REST Routes    //
	///////////////////////


	var PATH = '/songs';
	server.get(PATH+'/:songid', findSong);
	// server.post(PATH, addSong);
	server.get(PATH,findSongs);
	// server.del(PATH+'/:id', deleteSong);

	
});


