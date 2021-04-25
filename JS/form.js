class Form{
    constructor(){
        this.input = createInput();
        this.button = createButton("Play");
        this.greeting = createElement("h1");

        this.reset = createButton("Reset");
    }

    hide(){
        this.input.hide();
        this.button.hide();
        this.greeting.hide();
    }

    display(){
        //create the title
        var title = createElement("h1");
        title.html("Tank Wars");
        title.position(displayWidth/2.25, displayHeight/2.5 - (displayHeight/8));

         this.input.position(displayWidth/2, displayHeight/2);
        this.input.center("horizontal");
        this.button.position(displayWidth/2, displayHeight/2 + 40);
        this.button.center("horizontal");
        this.reset.position(10, 10);

        //do stuff when you hit the play button
        this.button.mousePressed(()=>{
            title.hide();
            this.input.hide();
            this.button.hide();

            player.name = this.input.value();
            playerCount++;
            player.index = playerCount;
            player.updateName();
            player.updateCount(playerCount);

            this.greeting.html("Welcome " + player.name + "!" + "\nLooking for an opponant...");
            this.greeting.position(displayWidth/2.1 - player.name.length * (displayWidth/110), displayHeight/2.5);
            this.greeting.center("horizontal");
        });

        //reset time
        this.reset.mousePressed(()=>{
            player.updateCount(0);
            game.updateState(0);
            game.declareVictor("None")

            database.ref('/').update({
                players: null,
                bullets: {
                    player1Bullets: ["P1"],
                    player2Bullets: ["P2"]
                }
            })
        });
    }
}