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
			alert('something went wrong with fetching data from DB');
		});
	}

	function registerEvents() {

		$(".searchClipsBtn").click(function() {
			searchASongFromYoutube($(".searchClipsText").val());
		});

	}



	///AJAX ACTIONS///
	function getYouTubeClips(data)
	{	
		$.each(data,function(index,obj) {
			appendMarkupToHTML(obj.embedUrl, obj.likes, obj._id);

		});

		registerClipEvents();
	}

	function registerClipEvents()
	{
		$(".likeImg").click(function()
		 {
		 	var mongoID = $(this).parent().attr("id");
			var elem = $(this).next();
			console.log(mongoID);
			addLike(mongoID, elem); 
		});

		$(".deleteImg").click(function()
		 {
		 	var mongoID = $(this).parent().attr("id");
			var elem = $(this).parent();
			console.log(mongoID);
			deleteASong(mongoID, elem); 
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
			getStatisticInfoFromYoutube(data.embedUrl,data._id);
			//add markup to HTML
			appendMarkupToHTML(data.embedUrl, 0 , data._id);
			registerClipEvents();
			console.log(data);
	
		}).error(function(err) {
			console.log(err);
			alert("Song already exists");
		});
	}

	function addLike(mongoID, elem) 
	{
		$.ajax({
			url: "/songs/likes/" + mongoID,
			type: "PUT"
			//data to post to server
			
		}).done(function(data) 
		{
			console.log(data.newLikesCount);
			elem.text(data.newLikesCount);

		}).error(function(err) {
			console.log(err);
		});
	}

	function deleteASong(mongoID, elem)
	{
		$.ajax({
			url: "/songs/" + mongoID,
			type: "DELETE"
			//data to post to server
			
		}).done(function(data) 
		{
			console.log(data.message);
			elem.remove();

		}).error(function(err) {
			console.log(err);
		});
	}



	function getStatisticInfoFromYoutube(songYoutubeID, mongoID)
	{
		var YouTubeAPIURL = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' + songYoutubeID + '&key=' + YouTubeAPIKey;
			$.ajax({
			url: YouTubeAPIURL,
			type: "GET"
			
		})
		.done(function(data) 
		{	
			var jsonToPut = new Object();
			//define items of the relavant data for us
			jsonToPut.viewCount  = data.items[0].statistics.viewCount;
			//do AJAX Call to REST
			addStatisticInfoFromYoutube(jsonToPut, mongoID);

		})
		.error(function(err) {
			console.log(err);
		});

	}

	function addStatisticInfoFromYoutube(jsonToPut,mongoID)
	{
		console.log(jsonToPut);
		$.ajax({
			url: "/songs/" + mongoID,
			type: "PUT",
			//data to post to server
			data: jsonToPut
			
		}).done(function(data) 
		{
			console.log("PUT: " + data);
			

		}).error(function(err) {
			console.log(err);
		});
	}

	function searchASongFromYoutube(song) {
		
		var YouTubeAPIURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q='+ song +'&key=' + YouTubeAPIKey;
			$.ajax({
			url: YouTubeAPIURL,
			type: "GET"
			
		})
		.done(function(data) 
		{	
			var category = $("#categoryDropdown").val() //the value of the selected option
			var jsonToPost = new Object();
			//define items of the relavant data for us
			var relavantData = data.items[0].snippet;

			//JSON to post to REST API
			jsonToPost.author = relavantData.title;
			jsonToPost.title = relavantData.title;
			//video id of YouTube
			jsonToPost.embedUrl = data.items[0].id.videoId;
			jsonToPost.category = category;
			//do AJAX Call to REST
			insertSongToDB(jsonToPost);

		})
		.error(function(err) {
			console.log(err);
			alert("Something went wrong with the query");
		});
	}

	///html helper func
	function appendMarkupToHTML(videoID, likes, objectID)
	{
		var markupToAppend = "<td><div class='songRow' id=" + objectID + ">"
		markupToAppend += "<iframe class='songIframe' src=" + YouTubeEmbedURL + videoID + "></iframe>'";
		markupToAppend += "<img class='deleteImg' src='img/delete.png'/>";
		markupToAppend += "<img class='likeImg' src='img/like.png'/>";
		markupToAppend += "<span class='likes'>" + likes + "</div></td>";

		$( ".songsContainer" ).append(markupToAppend);	
	}
});