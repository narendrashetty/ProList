ProList.controller('HomeController', [
	'$scope',
	'$http',
	function ($scope, $http) {
		$scope.search = function() {
			$http.get('https://www.googleapis.com/youtube/v3/search', {
				params: {
					key: 'AIzaSyCZAyY8g6lrV7kFuy58orbsj6LLKuhNEHQ',
					type: 'video',
					maxResults: '20',
					part: 'id,snippet',
					fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default',
					q: this.query
				}
			})
			.success( function (data) {
				console.log(data);
			})
			.error( function () {

			});
		};
	}]);