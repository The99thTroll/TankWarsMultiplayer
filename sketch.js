var database;

var game, gameState;
var player, playerCount;
var form;

var tank1, tank2;
var lightTankBlue_ing, lightTankRed_img;
var direction, readyToFire, victor;
var tanks, bullets, bulletsData;

var otherTankLocator, arrow_img;

var yVel, xVel;

var allPlayers;

function preload() {
  lightTankBlue_img = loadImage("Assets/LightTankBlue.png");
  lightTankRed_img = loadImage("Assets/LightTankRed.png");

  arrow_img = loadImage("Assets/arrow.png");
}

function setup() {
  //create the canvas
  createCanvas(800, 500);

  //create the database
  database = firebase.database();

  //set the variables
  gameState = 0;
  yVel = 0;
  xVel = 0;
  bullets = [];
  enemyBullets = [];
  bulletsData = [];
  readyToFire = 0;
  victor = "";

  //start the game
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  //draw the background
  background(255,255,255);  

  //start the game
  if(playerCount === 2 && (victor === "" || victor === "None")){
    game.updateState(1);
  }

  //start the game for real
  if(gameState === 1){
    game.play();
  }

  //end the game
  if(victor !== "" && victor !== "None"){
    game.updateState(2);
  }

  //show end screen
  if(gameState === 2){
    game.podium();
  }
}