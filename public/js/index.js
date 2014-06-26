var YouTubeAPIKey = 'AIzaSyDoNhvgqnNXC9ushmSmrP3tFvRq39YqWVQ';
var YouTubeEmbedURL = "http://www.youtube.com/embed/";


$(document).ready(function() {
	
	init();

	function init() {

		registerEvents();

		$.ajax({
			url: "/songs",
			type: "GET"
			
		}).done(function(data) {
			console.log(data);
			getYouTubeClips(data);

		}).error(function(err) {
			console.log(err);
		});
	}

	function registerEvents() {

		$(".searchClipsBtn").click(function() {
			addASong($(".searchClipsText").val());
		});

	}

	function insertSongToDB(jsonToPost)
	{
		$.ajax({
			url: "/songs",
			type: "POST",
			//data to post to server
			data: jsonToPost
			
		}).done(function(data) 
		{
			//add markup to HTML
			appendMarkupToHTML(data.embedUrl, 0 , data._id);
			console.log("json post OK");

		}).error(function(err) {
			console.log("json post Fail");
		});
	}


	function getYouTubeClips(data)
	{	
		$.each(data,function(index,obj) {
			appendMarkupToHTML(obj.embedUrl, obj.likes, obj._id);

		});

		$(".likeImg").click(function()
		 {
		 	var mongoID = $(this).parent().attr("id");
			var elem = $(this).next();
			console.log(mongoID);
			addLike(mongoID, elem); 
		});
	}

	function addLike(mongoID, elem) 
	{
		$.ajax({
			url: "/songs/likes/" + mongoID,
			type: "PUT",
			//data to post to server
			data: mongoID
			
		}).done(function(data) 
		{
			console.log(data.newLikesCount);
			elem.text(data.newLikesCount);

		}).error(function(err) {
			console.log(err);
		});
	}

	function deleteASong()
	{
		
	}

	function addASong(song) {
		
		var YouTubeAPIURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q='+ song +'&key=' + YouTubeAPIKey;
		$.ajax({
			url: YouTubeAPIURL,
			type: "GET"
			
		})
		.done(function(data) 
		{	
			var jsonToPost = new Object();
			//define items of the relavant data for us
			var relavantData = data.items[0];
			//video id of YouTube
			var videoID = relavantData.id.videoId;

			//JSON to post to REST API
			jsonToPost.author = relavantData.snippet.title;
			jsonToPost.title = relavantData.snippet.title;
			jsonToPost.embedUrl = videoID;
			jsonToPost.likes = 0;
			//do AJAX Call to REST
			insertSongToDB(jsonToPost);

		})
		.error(function(err) {
			console.log(err);
		});
	}

	function appendMarkupToHTML(videoID, likes, objectID)
	{
		var markupToAppend = "<div class='songRow' id=" + objectID + ">"
		markupToAppend += "<iframe class='songIframe' src=" + YouTubeEmbedURL + videoID + "></iframe>'";
		markupToAppend += "<img class='likeImg' src='img/like.png'/>";
		markupToAppend += "<span class='likes'>" + likes + "</div>";

		$( ".songsContainer" ).append(markupToAppend);	
	}
});