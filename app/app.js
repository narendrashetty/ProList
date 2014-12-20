var ProList = angular.module('ProList', ['ngRoute']);

ProList.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.otherwise('/')
	.when('/', {
		templateUrl: 'app/views/home.html',
		controller: 'HomeController'
	})
}]);