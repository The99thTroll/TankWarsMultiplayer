class Player{
    constructor(){
        this.index = null;
        this.yPos = 0;
        this.xPos = 0;
        this.name = null;
        this.health = 100;
        this.rotation = 0;
        this.bullets = [];
    }

    getCount(){
        var playerCountRef = database.ref('playerCount');
        playerCountRef.on('value', (data)=>{
            playerCount = data.val();
        });
    }

    updateCount(count){
        database.ref('/').update({
            playerCount: count
        });
    }

    updateName(){
        var playerIndex = "players/player" + this.index;
        database.ref(playerIndex).set({
            name: this.name,
            yPos: this.yPos,
            xPos: this.xPos,
            health: this.health,
            rotation: this.rotation,
        });
    }

    removeBullet(id){
        var playerIndex = "players/player" + id;
        database.ref(playerIndex).update({
            bullets: [],
        });
    }

    static getPlayerInfo(){
        var playerInfoRef = database.ref('players');
        playerInfoRef.on("value",(data)=>{
            allPlayers = data.val();
        });
    }
}