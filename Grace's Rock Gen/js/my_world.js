"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/
let img, bugImg, slugImg;

function p3_preload() {
  slugImg = loadImage("https://cdn.glitch.global/8b4022f8-7c0a-4cd6-a8ca-db668d98e37d/Untitled16_20250428215652.png?v=1745906989878");
  bugImg = loadImage("https://cdn.glitch.global/8b4022f8-7c0a-4cd6-a8ca-db668d98e37d/Untitled17_20250428220714.png?v=1745906987097");
  img = loadImage("https://cdn.glitch.global/8b4022f8-7c0a-4cd6-a8ca-db668d98e37d/Untitled15_20250428213240.png?v=1745901198907");
}

let imgX = 0;  
let imgY = 0;    
let imgSpeedX = 0.5; 
let imgSpeedY = 0.5;

let bugs = [];
let snailTile = [];

function spawnBug() {
  bugs.push({
    x: random(width),
    y: random(height),
    speedX: random(-2, 2),
    speedY: random(-2, 2),
    size: 64
  });
}



function p3_setup() {
  createCanvas(700, 400);
  background(0, 0, 0);
  
  for (let i = 0; i < 20; i++) {
    spawnBug();
  }
  
  for (let n = 0; n < 20; n++) {
    snailTile.push({
      i: random(-50, 50), // wider horizontal range
      j: random(-50, 50), // wider vertical range
      di: random([-0.02, 0.02]),
      dj: random([-0.01, 0.01])
    });
  }
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {
  background(40, 40, 40);
  
  for (let snail of snailTile) {
    snail.i += snail.di;
    snail.j += snail.dj;

    if (snail.i > 20) snail.i = 0;
    if (snail.i < 0) snail.i = 20;
    if (snail.j > 20) snail.j = 0;
    if (snail.j < 0) snail.j = 20;
  }

}

function p3_drawTile(i, j) {
  
  noStroke();

  push();

  // fill background
  //fill(110, 110, 100);
  fill(150);
  
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  randomSeed(XXH.h32("tile:" + [i, j], worldSeed)); // Fix randomSeed usage
  
  // brick sizing
  let rows = 2;
  let cols = 1.5;
  let brickW = (tw * random(1, 2)) / cols;    // make the width random
  //let brickW = (tw * 2) / cols;
  let brickH = (th * 2) / rows;

  // with gaping
  // Drawing bricks in a 4x4 grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // stagger the bricks to every other row 
      let offsetX = (row % 2 === 1) ? 20 : 0;
      let x = -tw + col * (brickW + 4) + offsetX;
      let y = -th + row * (brickH + 4);
      
      fill(160 + random(-10, 10), 120 + random(-10, 10), 75 + random(-10, 10));
      rect(x, y, brickW - 4, brickH - 4, 5);
      
    }
    
  }

  pop();

  randomSeed(XXH.h32("snailspawn:" + [i, j], worldSeed)); // consistent per tile

  if (random() < 0.05) { 
    push();
    translate(0, -20);
    imageMode(CENTER);
    image(img, 0, 0, 48, 48);
    pop();
  }
  
  for (let snail of snailTile) {
    // Check if the snail is on this tile
    if (Math.floor(snail.i) === i && Math.floor(snail.j) === j) {
      push();
      translate(0, -20); // Raise snail above tile
      imageMode(CENTER);
      image(slugImg, 0, 0, 48, 48);
      pop();
    }
  }
  
  randomSeed(XXH.h32("slug:" + [i, j], worldSeed));
  let n = clicks[[i, j]] | 2;
  if (n % 2 == 1) {   
    // shadow
    translate(0, -10);
    fill(0, 0, 0, 85);
    ellipse(0, 0, 35, 10);
    
    //translate(tw * i, th * j);
    translate(0, -10);    // random position on tile
    rotate(random(TWO_PI));   // random rotation
    
    // body
    fill(255, 255, random(100, 150), 255); 
    ellipse(0, 0, 30, 10);

    // head
    fill(200, 170, 50, 255); 
    ellipse(10, 0, 10, 8); 

    // antennaes
    stroke(200, 170, 50, 255);
    strokeWeight(1.5);
    line(12, -2, 16, -6);
    line(12, 2, 16, 6);
  }

}


function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0); 
}

function p3_drawAfter() {
  for (let bug of bugs) {
    // Draw the snail
    image(bugImg, bug.x, bug.y, bug.size, bug.size);
    
    // Move the snail
    bug.x += bug.speedX;
    bug.y += bug.speedY;
  }
}
