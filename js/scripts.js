var app = angular.module('cardsApp', ['ui.router', 'ngAnimate', 'ui-notification']);

app.config(function($stateProvider, $locationProvider, $urlRouterProvider, NotificationProvider) {
    
    NotificationProvider.setOptions({
            delay: 3000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'bottom'
    });
    
    $locationProvider.hashPrefix('')
    $urlRouterProvider.otherwise('/');
  $stateProvider.state({
    name: 'default',
    url: '/',
    templateUrl: 'panel.htm'
  }).state({
    name: 'list',
    url: '/list',
    templateUrl: 'list.htm'
  }).state({
    name: 'test',
    url: '/test',
    templateUrl: 'test.htm'
  });
//  .state({
//    name: 'config',
//    url: '/config',
//    templateUrl: 'config.htm'
//  });
});

app.service('storage', function() {
    this.saveCards = function(cards) {
        var result = [];
        cards.forEach(function(item){
            result.push(JSON.stringify(item));
        });
        localStorage.setItem('fastCards', result.join('|'));
        return true;
    };
    
    this.getCards = function() {
        var result = "", cards = [], newItem, firstItem = true; 
        result = localStorage.getItem('fastCards');
        
        if(result == "" || result == null) {
            result = '{"question":"Gdzie urodził się Fryderyk Chopin?","answer":"Żelazowa Wola","active":true}|{"question":"W który roku zmarł Ludwig van Beethoven?","answer":"1827r."}|{"question":"W którym roku urodził się Wolfgang Amadeus Mozart?","answer":"1756r."}|{"question":"Gdzie umarł Johannes Brahms?","answer":"W Wiedniu"}|{"question":"W jakich latach żył Georg Friedrich Händel?","answer":"1685 - 1759"}';
        }
            
        result = result.split('|');
        result.forEach(function(item){
            newItem = JSON.parse(item);
            if(firstItem) {
                newItem.active = true;
                firstItem = false;
            } else {
                newItem.active = false;
            }
            newItem.hover = false;
            newItem.success = undefined;
            cards.push(newItem);
        });
        
        return cards;
    };
}); 

app.service('helpers', function() {
   this.shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    } 
});

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

app.controller('cardsCtrl', function($scope, $timeout, storage, helpers, Notification) {
    var vm = this;
    vm.loader = true;
    vm.image = null;
    vm.imageText = null;
    vm.question = "";
    vm.answer = "";
    vm.history = [];
    vm.cards = storage.getCards();
    vm.cardsTest = vm.cards;
    vm.currentCard = 0;

    vm.saveHistory = function() {
        vm.history.push(JSON.stringify(vm.cards));
    };
    
    vm.backHistory = function(){
        if(vm.history.length > 0) {
            vm.cards = JSON.parse(vm.history[vm.history.length-2]);
            vm.history.splice(-1);
        }
    };
    vm.saveHistory();  
    
    vm.toggleHover = function(index) {
        if(vm.cards[index].hover) {
            vm.cards[index].hover = false;
        } else {
            vm.cards[index].hover = true;
        }
    };
    
    vm.removeCard = function(index) {
        if(vm.cards[index].active) {
            vm.changeCard(index+1);
            vm.changeCard(index-1);
        }
        if(index <= vm.currentCard) vm.currentCard--;
        vm.cards.splice(index, 1); 
        
        vm.saveHistory();
    };
    
    
    vm.addCard = function() {
        if(vm.question != "" && vm.answer != "") {
            vm.cards.push({
                image: vm.image,
                imageText: vm.imateText,
                question: vm.question,
                answer: vm.answer
            });
            if(vm.cards.length==1){
                vm.cards[0].active=true;
                vm.currentCard = 0
            }
            vm.image = null;
            vm.imageText = null;
            vm.question = "";
            vm.answer = "";
            vm.saveHistory();
        } else {
            Notification.warning('Wprowadź pytanie i odpowiedź!');
        }
    };
    
    vm.changeCard = function(index, success) {
        if(success == true) {
            vm.cards[vm.currentCard].success = true;
        } else if(success == false){
            vm.cards[vm.currentCard].success = false;
        }
        if(index == vm.cards.length && success != undefined) {
            var count = 0, countSuccess = 0;
            vm.cards.forEach(function(item){
                if(item.success == true) {
                    countSuccess++;
                } 
                count++;
                item.success = undefined;
            });
            vm.currentCard = 0;
            vm.cards[vm.cards.length-1].active = false;
            vm.cards[0].active = true;
            
            Notification.primary("Twój wynik to: " + countSuccess+"/"+ count);
        }
        if(index >= 0 && index < vm.cards.length) {
            vm.cards[vm.currentCard].active=false;
            vm.currentCard = index;
            vm.cards[vm.currentCard].active=true;
            vm.cards.forEach(function(item){
               item.hover = false; 
            });
        }
    };
    
    vm.syncCards = function() {
        if(storage.saveCards(vm.cards) && !vm.notiSuccess) {
            
            Notification.success("Zapisano aktualny stan fiszek!");
        }
    };
    
    vm.startTest = function(){
        vm.changeCard(0);
    };
});