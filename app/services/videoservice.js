ProList.service('VideoService', [
	'$window',
	'$rootScope',
	function ($window, $rootScope) {

	var youtube = {
	    ready: false,
	    player: null,
	    playerId: null,
	    videoId: null,
	    videoTitle: null,
	    playerHeight: '200',
	    playerWidth: '420',
	    state: 'stopped',
	    currentVideo: 1
	},
	service = {
		updateList: function(data) {
			var searchList = [];
			var list = data.items;
			for (var i = 0, len = list.length; i < len; i++) {
		      searchList.push({
		        id: list[i].id.videoId,
		        title: list[i].snippet.title,
		        description: list[i].snippet.description,
		        thumbnail: list[i].snippet.thumbnails.default.url
		      });
		    }
		    return searchList;
		},

		addPlaylist: function (videoID, title) {
			var id = 0,
				tempId = 0,
				video = {},
				tempVideo = {},
				isDuplicate = false;
			for (var key in localStorage) {
				if(key.indexOf('ProList_playlist_') == 0) {
					tempId = +key.match(/\d+$/)[0];
					tempVideo = JSON.parse(localStorage[key]);
					if (tempVideo.id === videoID) {
						isDuplicate = true;
						break;
					}
					id = (id < tempId) ? tempId : id;
				}
			}
			if(!isDuplicate) {
				++id;
				video = {
					id: videoID,
					title: title,
					viewed: false,
					position: id
				};
				localStorage['ProList_playlist_' + id] = JSON.stringify(video);
				if(id===1) {
					this.launchVideo(videoID, title, id);
				}
			}
			return this.getPlaylist();
		},

		getPlaylist: function () {
			var list = [];
			for (var video in localStorage) {
				if(video.indexOf('ProList_playlist_') == 0) {
					list.push(JSON.parse(localStorage[video]));
				}
			}
			return list;
		},

		deleteVideo: function (position) {
			localStorage.removeItem('ProList_playlist_'+position);
			return this.getPlaylist();
		},

		getVideo: function (id) {
			if(localStorage['ProList_playlist_'+id]) {
				return JSON.parse(localStorage['ProList_playlist_'+id]);
			}
			for (var video in localStorage) {
				if(video.indexOf('ProList_playlist_') == 0) {
				return JSON.parse(localStorage[video]);
				}
			}
		},

		getCurrent: function () {
			return youtube;
		},

		bindPlayer: function (elementId) {
		    youtube.playerId = elementId;
		},

		createPlayer: function () {
		    return new YT.Player('player', {
		      height: youtube.playerHeight,
		      width: youtube.playerWidth,
		      playerVars: {
		        rel: 0,
		        showinfo: 0
		      },
		      events: {
		        'onReady': onYoutubeReady,
		        'onStateChange': onYoutubeStateChange
		      }
		    });
	  	},

	  	loadPlayer: function () {
		    if (youtube.ready) {
		      if (youtube.player) {
		        youtube.player.destroy();
		      }
		      youtube.player = this.createPlayer();
		    }
		},

	  	launchNext: function () {
		    var video = this.getVideo(youtube.currentVideo);
		    this.launchVideo(video.id, video.title, youtube.currentVideo);
		},

		launchVideo: function (id, title, position) {
		    youtube.player.loadVideoById(id);
		    youtube.videoId = id;
		    youtube.videoTitle = title;
		    youtube.currentVideo = position;
		    return youtube;
		},
	};

	$window.onYouTubeIframeAPIReady = function () {
	    youtube.ready = true;
	    service.loadPlayer();
	    $rootScope.$apply();
	};

	function onYoutubeReady (event) {
		var video = service.getVideo(youtube.currentVideo);
		if (video) {
		    youtube.player.cueVideoById(video.id);
		    youtube.videoId = video.id;
		    youtube.videoTitle = video.title;
		}
	}

	function onYoutubeStateChange (event) {
	    if (event.data == YT.PlayerState.PLAYING) {
	      youtube.state = 'playing';
	    } else if (event.data == YT.PlayerState.PAUSED) {
	      youtube.state = 'paused';
	    } else if (event.data == YT.PlayerState.ENDED) {
	      youtube.state = 'ended';
	      youtube.currentVideo++;
	      service.launchNext();
	    }
	    $rootScope.$apply();
	}

	return service;
}]);