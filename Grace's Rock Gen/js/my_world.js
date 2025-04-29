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
let img;

function p3_preload() {
  img = loadImage("https://cdn.glitch.global/8b4022f8-7c0a-4cd6-a8ca-db668d98e37d/snail.png?v=1745892976515");
}

let imgX = 0;  
let imgY = 0;    
let imgSpeedX = 0.5; 
let imgSpeedY = 0.5;

let snails = [];
let snailTile = [];

function spawnSnail() {
  snails.push({
    x: random(width),
    y: random(height),
    speedX: random(-2, 2),
    speedY: random(-2, 2),
    size: 64
  });
}

let worldSnails = [];

function spawnWorldSnail(i, j) {
  worldSnails.push({
    i: i + random(-0.5, 0.5), // random offset within the tile
    j: j + random(-0.5, 0.5),
    di: random([-0.01, 0.01]),
    dj: random([-0.01, 0.01])
  });
}



function p3_setup() {
  createCanvas(700, 400);
  background(0, 0, 0);
  
  for (let i = 0; i < 20; i++) {
    spawnSnail();
  }
  
  for (let n = 0; n < 10; n++) {
    snailTile.push({
      i: random(0, 10),
      j: random(0, 10),
      di: random([-0.02, 0.02]),  // horizontal speed
      dj: random([-0.01, 0.01])   // vertical speed
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
      
      //fill(random(175, 125) + random(-10, 10), 85 + random(-10, 10), 80 + random(-10, 10));  
      fill(160 + random(-10, 10), 120 + random(-10, 10), 75 + random(-10, 10));
      //fill(random(170, 200) + random(-10, 10), random(130, 170) + random(-10, 10), random(50, 80) + random(-5, 5));
      rect(x, y, brickW - 4, brickH - 4, 5);
      
    }
    
  }
  
  /*// without the gaps
  // Drawing bricks in a 4x4 grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // stagger the bricks to every other row 
      let offsetX = (row % 2 === 1) ? 20 : 0;
      let x = -tw + col * (brickW) + offsetX;
      let y = -th + row * (brickH);
      
      //fill(random(175, 125) + random(-10, 10), 85 + random(-10, 10), 80 + random(-10, 10));  
      fill(160 + random(-10, 10), 120 + random(-10, 10), 70 + random(-10, 10));
      rect(x, y, brickW, brickH, 5);
    }
    
  }*/
  
  pop();
  
  for (let snail of snailTile) {
    // Check if the snail is on this tile
    if (Math.floor(snail.i) === i && Math.floor(snail.j) === j) {
      push();
      translate(0, -20); // Raise snail above tile
      imageMode(CENTER);
      image(img, 0, 0, 48, 48);
      pop();
    }
  }
  
  randomSeed(XXH.h32("slug:" + [i, j], worldSeed));
  let n = clicks[[i, j]] | 2;
  if (n % 2 == 1) {
    /*fill(0, 0, 0, 100);
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 255);
    ellipse(0, 0, 10, 10);*/
    
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
  for (let snail of snails) {
    // Draw the snail
    image(img, snail.x, snail.y, snail.size, snail.size);
    
    // Move the snail
    snail.x += snail.speedX;
    snail.y += snail.speedY;
  }
}
