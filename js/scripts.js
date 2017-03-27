var app = angular.module('cartsApp', []);
app.controller('cartsCtrl', function($scope) {
    $scope.currentCart = 0;
    $scope.loader = true;
    $scope.question = "";
    $scope.answer = "";
    $scope.carts = [
            {
                question: "Gdzie urodził się Fryderyk Chopin?",
                answer: "Żelazowa Wola"
            },
            {
                question: "W który roku zmarł Ludwig van Beethoven?",
                answer: "1827r."
            },
            {
                question: "W którym roku urodził się Wolfgang Amadeus Mozart?",
                answer: "1756r."
            },
            {
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
    
    $scope.toggleConfig = function(index) {
        if($scope.config) {
            $scope.config = false;
        } else {
            $scope.config = true;
        }
    }
    
    $scope.removeCart = function(index) {
        if($scope.carts[index].active) {
            $scope.changeCart(index+1);
            $scope.changeCart(index-1);
        }
        if(index <= $scope.currentCart) $scope.currentCart--;
        $scope.carts.splice(index, 1); 
        
    };
    
    $scope.addCart = function(index) {
        if($scope.question != "" && $scope.answer != "") {
            $scope.carts.push({
                question: $scope.question,
                answer: $scope.answer
            });
            if($scope.carts.length==1){
                $scope.carts[0].active=true;
                $scope.currentCart = 0
            }
            $scope.question = "";
            $scope.answer = "";
        } else {
            alert("Wprowadź pytanie i odpowiedź.");
        }
    };
    
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