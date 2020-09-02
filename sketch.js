var dog,dogImg;
var happyDog,happyDogImg;
var db;
var foodS;
var foodStock;
var fedTime;
var lastFed;
var foodObj;

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
	createCanvas(1000, 500);
  db = firebase.database();

  dog = createSprite(550,250);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  foodObj = new Food();

  foodStock = db.ref('Food');
  foodStock.on("value",readStock);
  feed = createButton("FEED DRAGO");
  feed.position(500,15);
  feed.mousePressed(FeedDog);
  add = createButton("ADD FOOD");
  add.position(400,15);
  add.mousePressed(AddFood);
}

function draw() {  
  background(46, 139, 87);

  fedTime = db.ref("FeedTime");
  fedTime.on("value",function(data) {
    lastFed = data.val();
  });

  foodObj.display(); 
  drawSprites();

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12) {
    text("Last Feed: " + lastFed%12 + "PM",350,30);
  }
}

function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {
  if(x<=0) {
    x = 0;
  }else {
    x = x-1;
  }
  db.ref('/').update({
    Food: x
  })
}

function AddFood() {
  foodS++;
  db.ref('/').update({
    Food:foodS
  })
}

function FeedDog(){
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  db.ref('/').update({
     Food:foodObj.getFoodStock(),
     FeedTime: hour()
  })
}