ProList.controller('HomeController', [
	'$scope',
	'$http',
	'VideoService',
	function ($scope, $http, VideoService) {

		$scope.results = [];
		$scope.playlist = VideoService.getPlaylist();

		$scope.search = function() {
			$http.get('https://www.googleapis.com/youtube/v3/search', {
				params: {
					key: 'AIzaSyCZAyY8g6lrV7kFuy58orbsj6LLKuhNEHQ',
					type: 'video',
					maxResults: '10',
					part: 'id,snippet',
					fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default',
					q: this.query
				}
			})
			.success( function (data) {
				$scope.results = VideoService.updateList(data);
			})
			.error( function () {

			});
		};

		$scope.queue = function (id, title) {
			$scope.playlist = VideoService.addPlaylist(id, title);
		};

		$scope.launch = function (id, title, position) {
			$scope.currentVideo = VideoService.launchVideo(id, title, position);
		};

		$scope.deleteVideo = function (position) {
			$scope.playlist = VideoService.deleteVideo(position);
		};
	}]);