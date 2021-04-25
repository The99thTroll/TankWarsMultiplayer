class Game{
    constructor(){
        this.modifierX = 0;
        this.modifierY = -100;
    }

    getState(){
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function(data){
            gameState = data.val();
        });
    }

    updateState(state){
        database.ref('/').update({
            gameState: state
        });
    } 

    getVictor(){
        var gameStateRef = database.ref('winner');
        gameStateRef.on("value", function(data){
            victor = data.val();
        });
    }

    declareVictor(winner){
        database.ref('/').update({
            winner: winner
        });
    } 

    getBullets(){
        var bulletRef = database.ref('bullets');
        bulletRef.on('value', (data)=>{
            bulletsData = data.val();
        });
    }

    updateBullets(target, data){
        if(target === 1){
            database.ref('bullets').update({
                player1Bullets: data
            });
        }else{
            database.ref('bullets').update({
                player2Bullets: data
            });
        }
    } 

    async start(){
        if(gameState === 0){
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            
            if(playerCountRef.exists()){
                playerCount = playerCountRef.val();
                player.getCount();
            }

            form = new Form();
            form.display();

            tank1 = createSprite(200, 300);
            tank2 = createSprite(400, 300);

            otherTankLocator = createSprite(300, 300, 20, 20);

            tank1.addImage("blue tank", lightTankBlue_img);
            tank2.addImage("red tank", lightTankRed_img);

            otherTankLocator.addImage("arrow", arrow_img)

            tank1.scale = 0.2;
            tank2.scale = 0.2;

            otherTankLocator.scale = 0.1;

            tanks = [tank1, tank2]

            camera.zoom = 0.5;

            this.getBullets();
        }
    }

    play(){
        form.hide();

        Player.getPlayerInfo();
        this.getBullets();

        if(allPlayers !== "undefined"){
            var index = 0;
            var x;
            var y;
            for(var plr in allPlayers){
                index += 1;
                if(index === 1){
                    x = 200
                }else{
                    x = 1200
                }
                x += allPlayers[plr].xPos;
                y = 250 + allPlayers[plr].yPos;
    

                if(index === player.index){
                    fill(3, 148, 252);
                    tanks[index - 1].rotation = player.rotation;
                    
                    camera.position.x = tanks[index - 1].x;
                    camera.position.y = tanks[index - 1].y;
                }else{
                    fill("black");
                    tanks[index - 1].rotation = allPlayers[plr].rotation;
                }

                tanks[index - 1].x = x;
                tanks[index - 1].y = y;

                textAlign(CENTER);
                textSize(20);
                text(allPlayers[plr].name, tanks[index - 1].x, tanks[index - 1].y + 75);

                //health display
                fill(56 + (200 - (allPlayers[plr].health * 2)), 209 - ((100 - allPlayers[plr].health) * 2), 56);
                text(allPlayers[plr].health.toString() + " HP", tanks[index - 1].x, tanks[index - 1].y + 100);
            }
        }

        //other tank detection
        if(player.index === 1){
            otherTankLocator.rotation =
            atan2(
              tank2.x - tank1.x,
              tank2.y - tank1.y
            ) * -1;

            otherTankLocator.x = tank1.x + this.modifierX
            otherTankLocator.y = tank1.y + this.modifierY

            if(tank2.x > camera.x - width && tank2.x < camera.x + width &&
                tank2.y > camera.y - height && tank2.y < camera.y + height){
                otherTankLocator.visible = false;
            }else{
                otherTankLocator.visible = true;
            }
        }else{
            otherTankLocator.rotation =
            atan2(
              tank1.x - tank2.x,
              tank1.y - tank2.y
            ) * -1;

            otherTankLocator.x = tank2.x + this.modifierX
            otherTankLocator.y = tank2.y + this.modifierY

            if(tank1.x > camera.x - width && tank1.x < camera.x + width &&
                tank1.y > camera.y - height && tank1.y < camera.y + height){
                otherTankLocator.visible = false;
            }else{
                otherTankLocator.visible = true;
            }
        }

        //movement and such
        if(player.index !== null){
            if(keyIsDown(38)){
                yVel -= 0.4;
                player.rotation = 0;

                this.modifierX = 0;
                this.modifierY = -100;
            }
            if(keyIsDown(37)){
                xVel -= 0.4;
                player.rotation = -90;

                this.modifierX = -100;
                this.modifierY = 0;
            }
            if(keyIsDown(39)){
                xVel += 0.4;
                player.rotation = 90;

                this.modifierX = 100;
                this.modifierY = 0;
            }
            if(keyIsDown(40)){
                yVel += 0.4;
                player.rotation = 180;

                this.modifierX = 0;
                this.modifierY = 125;
            }

            if(keyIsDown(38) && keyIsDown(37)){
                player.rotation = -45;

                this.modifierX = -75;
                this.modifierY = -75;
            }
            if(keyIsDown(38) && keyIsDown(39)){
                player.rotation = 45;

                this.modifierX = 75;
                this.modifierY = -75;
            }
            if(keyIsDown(40) && keyIsDown(37)){
                player.rotation = -135;

                this.modifierX = -75;
                this.modifierY = 75;
            }
            if(keyIsDown(40) && keyIsDown(39)){
                player.rotation = 135;

                this.modifierX = 75;
                this.modifierY = 75;
            }

            //shooting code
            if(keyIsDown(32) && readyToFire === 0){
                readyToFire = 30;

                var bulletVelX = 0;
                var bulletVelY = 0;

                switch(player.rotation){
                    case 0:
                        bulletVelX = 0;
                        bulletVelY = -15;
                        break
                    case 180:
                        bulletVelX = 0;
                        bulletVelY = 15;
                        break
                    case 90:
                        bulletVelX = 15;
                        bulletVelY = 0;
                        break
                    case -90:
                        bulletVelX = -15;
                        bulletVelY = 0;
                        break
                    case 45:
                        bulletVelX = 12.5;
                        bulletVelY = -12.5;
                        break
                    case -45:
                        bulletVelX = -12.5;
                        bulletVelY = -12.5;
                        break
                    case 135:
                        bulletVelX = 12.5;
                        bulletVelY = 12.5;
                        break
                    case -135:
                        bulletVelX = -12.5;
                        bulletVelY = 12.5;
                        break
                }

                
                if(player.index === 1){
                    x = 200
                }else{
                    x = 1200
                }

                x += player.xPos;
                y = 250 + player.yPos;
                var bullet = createSprite(x, y, 10, 10);
                bullet.depth = -1;

                bullets.push([bullet, bulletVelX, bulletVelY])

                var bulletList = [];

                if(player.index === 1){
                    bulletList = bulletsData["player1Bullets"]
                }else{
                    bulletList = bulletsData["player2Bullets"]
                }

                bulletList.push([bullet.x, bullet.y, bulletVelX, bulletVelY])

                this.updateBullets(player.index, bulletList);
            }

            for(var x = 0; x < bullets.length; x++){
                bullets[x][0].x += bullets[x][1];
                bullets[x][0].y += bullets[x][2];
            }

            for(var x = 0; x < enemyBullets.length; x++){
                enemyBullets[x][0].x += enemyBullets[x][1];
                enemyBullets[x][0].y += enemyBullets[x][2];
            }
        }

        if(readyToFire > 0){
            readyToFire--;
        }

        //localize enemy bullets
        var dataToManipulate = [];
        if(player.index === 1){
            dataToManipulate = bulletsData["player2Bullets"]
        }else{
            dataToManipulate = bulletsData["player1Bullets"]
        }
        
        for(var x = 1; x < dataToManipulate.length; x++){
            var enemyBullet = createSprite(dataToManipulate[x][0], dataToManipulate[x][1], 10, 10);
            enemyBullet.depth = -1;
            enemyBullets.push([enemyBullet, dataToManipulate[x][2], dataToManipulate[x][3]]);

            dataToManipulate.splice(1, 1);

            this.updateBullets(player.index - 1, dataToManipulate);
        }

        //test for bullet collisions
        for(var x = 0; x < enemyBullets.length; x++){
            if(player.index === 1){
                if(tank1.isTouching(enemyBullets[x][0])){
                    enemyBullets[x][0].destroy();
                    player.health-=20;
                }
            }else{
                if(tank2.isTouching(enemyBullets[x][0])){
                    enemyBullets[x][0].destroy();
                    player.health-=20;
                }
            }
        }

        for(var x = 0; x < bullets.length; x++){
            if(player.index === 1){
                if(tank2.isTouching(bullets[x][0])){
                    bullets[x][0].destroy();
                }
            }else{
                if(tank1.isTouching(bullets[x][0])){
                    bullets[x][0].destroy();
                }
            }
        }

        //end the game
        if(player.health <= 0){
            console.log(allPlayers);
            if(player.index === 1){
                this.declareVictor(allPlayers["player1"].name);
            }else{
                this.declareVictor(allPlayers["player2"].name);
            }
        }

        this.getVictor();

        yVel *= 0.95;
        xVel *= 0.95;

        player.yPos += yVel;
        player.xPos += xVel;

        player.updateName();
        //display sprites
        drawSprites();
    }

    podium(){
        camera.position.x = 400;
        camera.position.y = 250;
        camera.zoom = 1;

        this.getVictor();
        textAlign(CENTER);
        textSize(50);
        text(victor + " Wins!", 400, 250);
    }
}
