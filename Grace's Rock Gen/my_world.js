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
}

function p3_setup() {
  background(0, 0, 0);
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
}

function p3_drawTile(i, j) {
  noStroke();

  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fill(240, 200);
  } else {
    fill(255, 200);
  }

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

  /* // first draft 
  // brick sizing
  let brickW = tw * 5 / 2;
  let brickH = th * 5 / 4;

  // Drawing bricks in a 4x4 grid
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 2; col++) {
      let offsetX = (row % 2 === 1) ? 20 : 5; // stagger bricks
      let x = -tw + col * brickW + offsetX;
      let y = -th + row * brickH;
      fill(random(175, 125) + random(-10, 10), 85 + random(-10, 10), 80 + random(-10, 10));
      rect(x, y, 100, 100);
    }
  }*/
  
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
  
  
  
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    //fill(255, 255, 100, 255);
    //ellipse(0, -5, 10, 10);

    translate(random(-tw/2, tw/2), random(-th/2, th/2));   // random position on tile
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
  
  pop();

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

}
