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

	function getYouTubeClips(data) {
		// TODO @eran
	}

	function addASong(song) {
		// TODO @eran
	}

});