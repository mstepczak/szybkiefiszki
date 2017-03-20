var app = angular.module('cartsApp', []);
app.controller('cartsCtrl', function($scope) {
    $scope.currentCart = 0;
    $scope.loader = true;
    $scope.carts = [
            {
                id: 0,
                question: "Gdzie urodził się Fryderyk Chopin?",
                answer: "Żelazowa Wola"
            },
            {
                id: 1,
                question: "W który roku zmarł Ludwig van Beethoven?",
                answer: "1827r."
            },
            {
                id: 2,
                question: "W którym roku urodził się Wolfgang Amadeus Mozart?",
                answer: "1756r."
            },
            {
                id: 3,
                question: "Gdzie umarł Johannes Brahms?",
                answer: "W Wiedniu"
            }
    ];
    
    $scope.carts[$scope.currentCart].active=true;
    
    $scope.toggleHover = function(index) {
        if($scope.carts[index].hover) {
            $scope.carts[index].hover = false;
        } else {
            $scope.carts[index].hover = true;
        }
    }
    
    $scope.changeCart = function(index) {
        if(index >= 0 && index < $scope.carts.length) {
            $scope.carts[$scope.currentCart].active=false;
            $scope.currentCart = index;
            $scope.carts[$scope.currentCart].active=true;
            $scope.carts.forEach(function(item){
               item.hover = false; 
            });
        }
    }
    
    
});