var ProList = angular.module('ProList', ['ngRoute']);

ProList.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.otherwise('/')
	.when('/', {
		templateUrl: 'app/views/home.html',
		controller: 'HomeController'
	})
}]);

ProList.run(function () {
	var tag = document.createElement('script');
	tag.src = "http://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});