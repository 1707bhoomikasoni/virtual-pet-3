var dog,happyDog,hungryDog,database,foodS,foodStock
var feed ,addFood;
var fedTime,lastFed;
var foodObj,sleepImg,runImg;
var changeState,readState;
var bedImg,garImg,washImg;
var gameState="hungry"
var gameStateRef,milk
var input,confirm
var rupees=500
var deadDog;

function preload(){
  hungryDog=loadImage("dogImg1.png")
  happyDog=loadImage("dogImg.png")
  bedImg=loadImage("Bed Room.png")
  garImg=loadImage("Garden.png")
  washImg=loadImage("Wash Room.png")
  sleepImg=loadImage("Lazy.png")
  runImg=loadImage("running.png")
  deadDog=loadImage("deadDog.png")
}

function setup(){
      database = firebase.database()
      createCanvas(1000, 500);
      readState=database.ref('gameState')
      readState.on("value",function(data){
        gameState=data.val;
      })
foodObj=new Food()
     
   dog=createSprite(800,220,150,150)
   dog.addImage("hungry",hungryDog)
   dog.addImage("happy",happyDog)
   dog.addImage("sleeping",sleepImg)
   dog.addImage("run",runImg)
   dog.scale=0.20;

      getGameState()


      feed=createButton("Feed the Dog")
      feed.position(700,95)
      feed.mousePressed(feedDog)
     
      addFood=createButton("Add Food")
      addFood.position(800,95)
      addFood.mousePressed(addFoods)

      confirm=createButton("Confirm it")
      confirm.position(1230,95)
      confirm.mousePressed(mousePressedOnConfirm)

     input=createInput("pet's name")
     input.position(1190,70)     
}

function draw() {  
      background("brown")
      textSize(20)
      push()
      fill("white")
      text("Last Feed : "+hour()+"PM",355,30)
      text("MONEY :"+rupees,100,30)
      pop()
      fill('yellow')
      text("(NOTE: 2 milk bottles are enough for one feed)",300,480)
      
      fedTime=database.ref("FeedTime")
      fedTime.on("value",function(data){
        lastFed=data.val()
      })
drawSprites()
      fill("black")
      textSize(20)
       currentTime=hour()
       if(currentTime===lastFed+1){
        update("playing")
        foodObj.garden()
        addFood.hide()
        feed.hide()
       }else if(currentTime===lastFed+2){
        update("sleeping")
         foodObj.bedroom()
         addFood.hide()
         feed.hide()
       }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
        update("bathing")
         foodObj.washroom()
         addFood.hide()
         feed.hide()
       }else{
        update("hungry")
        addFood.show()
         foodObj.display()
       }
       
foodObj.getFoodStock()

if(gameState!="hungry"){
feed.hide()
addFood.hide()
dog.remove()
}else{
  feed.show()
  addFood.show()
  dog.addImage("hungry",hungryDog)
}
 }

function readStock(data)
 {
    foodS = data.val()
    foodObj.updateFoodStock(foodS)
 }

function feedDog(){
  dog.addImage(happyDog)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodObj.updateFoodStock(foodObj.getFoodStock()+1)
  foodStock++
  database.ref('/').update({
    Food:foodObj.getFoodStock()
  })
rupees=rupees-10
if(rupees<=0){
rupees=0
dog.addImage(deadDog)
}       
}

function getGameState(){
gameStateRef=database.ref('gameState')
gameStateRef.on("value",function(data){
  gameState=data.val()
})
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}

function mousePressedOnConfirm(){
  input.hide()
  confirm.hide()
}