$(function() {
    var theme = "tom_";
    var data = {
        lastID: 0,
        flipID: 0,
        internalId:0,
        cards: []
    };

    var data2 = {
        items: []
    };

    var currentPlayer;

    var internalIndex = new Array();

    var TotalCard = 6;
    var totalCount = 0;
    var storedItem = new Array(-1, -1);
    var flippedCards = new Array(-1, -1);
    
    var playerScore = new Array();

    var octopus = {
        addCards: function() {
            var thisID = ++data.lastID;
            data.cards.push({
                id: thisID,
                flip: 0,
                internalID:internalIndex[thisID-1],
                visible: false
            });
            
            view.render();
        },

         setTotalCards:function(totalNum) {
             currentPlayer = 0;
             TotalCard = totalNum;
             var arr = [];
             for (var k = 0; k < totalNum; k++) {
                 playerScore.push(0);

             }
             for (var k = 0; k < totalNum / 2; k++) {
                 internalIndex.push(k);
                 internalIndex.push(k);
             }

             for (var indx = 0; indx < totalNum ; indx++) {
                 var newIndx = parseInt(Math.floor((Math.random() * (totalNum)) + 1));
                 if (newIndx < totalNum/2 ) {
                     console.log(newIndx);
                     var temp = internalIndex[indx];
                     internalIndex[indx] = internalIndex[newIndx];
                     internalIndex[newIndx] = temp;
                 }
             }

         
         },
         Reset: function () {
             data.lastID = 0;
             data.cards = [];
             playerScore = [];
         },
        getTotalCards:function() {

            return TotalCard;
        },

        getPlayerNumber:function() {
            return currentPlayer;
        },

      

        updateAndGetScore:function() {
              
              if (storedItem[0] === storedItem[1]) {
                  playerScore[currentPlayer] = playerScore[currentPlayer] + 1;
               }
            var score = playerScore[currentPlayer];
            currentPlayer = (currentPlayer + 1) % 2;
            return score;



        },

        getWinner:function() {
            if (playerScore[currentPlayer] > playerScore[(currentPlayer + 1) % 2]) {
                return currentPlayer;
            } else {
                return (currentPlayer + 1) % 2;
            }
        },

        resetTotalCount:function() {
            totalCount = 0;
        },
         resetFirstAndLast:function() {
             if (storedItem[0] != storedItem[1]) {
                 view.renderOriginal(flippedCards[0], flippedCards[1]);
             } else {
                 totalCount = totalCount + 2;
                 view.removeCards(flippedCards[0], flippedCards[1]);
             }
            storedItem[0]= -1;
            storedItem[1]= -1;
            flippedCards[0] = -1;
            flippedCards[1] = -1;
         },
        
        AllDone:function() {
            if (storedItem[0] != -1 && storedItem[1] != -1 &&   totalCount >= TotalCard-2) {
                return true;
            }
            return false;

        },
       
        init: function() {
            view.init();
        },
        getVisiblePizzas: function() {
            return data.cards;
        },
        flipImage :function(id) {
            data.cards[id-1].flip = 1;
            view.renderflip();
            data.cards[id - 1].flip = 0;
        },

        getIndex:function() {
            for (var i = 0; i < data.cards.length; i++) {
                if (data.cards[i].flip === 1) {
                    if (flippedCards[0] === -1) {
                        flippedCards[0] = i;
                    } else {
                        flippedCards[1] = i;
                    }
                    return i;
                }
            }
            return -1;
        },
        getInternalIndex:function(id) {
            return data.cards[id].internalID;
        },

       

        IsFull:function() {
            return storedItem[0] != -1 && storedItem[1] != -1;
        },

        addIndex: function (id) {
            if (storedItem[0] === -1) {
                storedItem[0] = data.cards[id-1].internalID;
            } else if (storedItem[1] === -1) {
                storedItem[1] = data.cards[id-1].internalID;
            }

        },

        addItems:function(item) {
            data2.items.push(item);
        },

        getAllItems:function() {
          return data2.items;
        }

};


    var view = {
        sleep: function () { t = setTimeout("flow()", 4000); },

        init: function() {
            var addPizzaBtn = $(".add-card");
            var numPlayers = 2;
            addPizzaBtn.click(function (event) {
                var numOfCards = parseInt($("#textbox1").val());
              
                if (numOfCards % 2 != 0) {
                    alert(" Enter an even number between 6 and 50");
                    return;
                }
                octopus.Reset();
                octopus.setTotalCards(numOfCards);
                octopus.resetFirstAndLast();
                for (i = 0; i < numOfCards; i++) {
                  octopus.addCards();

              }
              var listPlayers = $("#players");
                
              for (k = 0; k < numPlayers; k++) {
                  var name = "#name" + k;
                  var playerName = $(name).val();
                  var player = listPlayers.find("#player" + k);
                  player.text(playerName);
              }
          
                
                octopus.resetTotalCount();
            });

            $("#play").click(function() {

                window.location.reload(false);
            });
            $("#switch").click(function (event) {
               var playerNum = octopus.getPlayerNumber();
               var score = octopus.updateAndGetScore();
               $("#score" + playerNum).html(score);
               octopus.resetFirstAndLast();
               var listPlayers = $("#players");
               var player = listPlayers.find("#player" + octopus.getPlayerNumber());
               var name = player.html();
                $("#player-name").html(name);
            });
        
            // grab elements and html for using in the render function
            this.$pizzaList = $('.pizza-list');
            this.pizzaTemplate = $('script[data-template="pizza"]').html();

            // Delegated event to listen for removal clicks
            this.$pizzaList.on('click', '.pizza', function (e) {
                var pizza = $(this).parents('.pizza').data();
                //octopus.flipImage()
                return false;
            });

            // Delegated event to listen for removal clicks
            this.$pizzaList.on('click', '.click-card', function (e) {
                if (!octopus.IsFull()) {
                    var pizza = $(this).parents('.pizza').data();
                    octopus.flipImage(pizza.id);
                    octopus.addIndex(pizza.id);

                }
                setTimeout(function() {
                    if (octopus.AllDone()) {
                        var listPlayers = $("#players");
                        var player = listPlayers.find("#player" + octopus.getWinner());
                        var name = player.html();
                         alert(name+ "  Won. Congrats !  ");
                         window.location.reload(false);
                     }
                }, 1000);
                return false;
            });

            this.render();
        },

  
        renderflip:function() {

            var list = document.getElementById("card").getElementsByTagName("li");
            var indx = octopus.getIndex();
            var indx1 = octopus.getInternalIndex(indx);
            var imgUrl = theme+indx1+".jpg";
            if (indx != -1) {
                item = list[indx];
               // $(item).find(".click-card").text("");
                $(item).css("background-image", 'url(' + imgUrl + ')');
              

            }
        },

        renderOriginal:function(id1,id2) {
            var list = document.getElementById("card").getElementsByTagName("li");
            var itm1 = list[id1];
            var itm2 = list[id2];
            var imgUrl = "";
            $(itm1).css("background-image", 'url(' + imgUrl + ')');
            $(itm2).css("background-image", 'url(' + imgUrl + ')');

        },

        removeCards:function(id1, id2) {
            var list = document.getElementById("card").getElementsByTagName("li");
            var itm1 = list[id1];
            var itm2 = list[id2];
            var imgUrl = "";
            $(itm1).css("background-image", 'url(' + imgUrl + ')');
            $(itm2).css("background-image", 'url(' + imgUrl + ')');
            $(itm1).css("background", "#FFFFFF");
            $(itm2).css("background", "#FFFFFF");
        },

        render: function() {
            // Cache vars for use in forEach() callback (performance)
            var $pizzaList = this.$pizzaList,
                pizzaTemplate = this.pizzaTemplate;

            // Clear and render
            $pizzaList.html('');
            octopus.getVisiblePizzas().forEach(function(pizza) {
                // Replace template markers with data
                var thisTemplate = pizzaTemplate.replace(/{{id}}/g, pizza.id);
                $pizzaList.append(thisTemplate);
            });

            var list = document.getElementById("card").getElementsByTagName("li");
            var len = octopus.getVisiblePizzas().length;
            for (var k = 0; k < list.length; k++) {
                item = list[k];
                $(item).hide();
            }
            for (var k = 0; k < list.length; k++) {
                item = list[k];
                $(item).show(1000);
                octopus.addItems(item);
            }


        }
    };

    octopus.init();
}());
