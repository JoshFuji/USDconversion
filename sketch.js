let currency;
let baseCurrency = 'USD';
let exchangeData;
let bubbles = [];

function setup() {
  let canvas = createCanvas(800, 600);
  loadJSON("https://v6.exchangerate-api.com/v6/dab48e0931ad93f17fc77e7c/latest/USD", gotData);
  canvas.parent('data');
}

function mousePressed() {
  for (let i = 0; i < bubbles.length; i++) {
    if (bubbles[i].rollover(mouseX, mouseY)) {
      bubbles[i].isMoving = !bubbles[i].isMoving;  
    } 
}
}

function gotData(data) {
  currency = data;

  // Create bubbles only after currency data is loaded
  let i = 0;
  for (let code in currency.conversion_rates) {
    if (i >= 60) break; //How many bubbles are on screen
    let x = random(width);
    let y = random(height);
    let r = map(currency.conversion_rates[code], 0, Math.max(...Object.values(currency.conversion_rates)), 25, 1000);  // Scale radius based on rate
    
    let b = new Bubble(x, y, r, 0, code, currency.conversion_rates[code]);
    bubbles.push(b);
    i++;
  }
}

function draw() {
  background(220);

  // Display bubbles and update positions
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].show();
    bubbles[i].bounce();
  }
}

class Bubble {
  constructor(tempX, tempY, tempR, tempB, currencyCode, rate) {
    this.x = tempX;
    this.y = tempY;
    this.r = tempR;
    this.brightness = tempB;
    this.currencyCode = currencyCode;
    this.rate = rate;
    this.speedX = random(-2, 2);
    this.speedY = random(-2, 2);
    this.isMoving = true;
  }

  rollover(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.r;
  }

  move() {
    if (this.isMoving) {
      this.x += this.speedX;
      this.y += this.speedY;
    }
  }

  show() {
    // Highlight the bubble if it's not moving
    if (this.isMoving) {
      noStroke();
      fill(this.brightness);
    } else {
      stroke(255);
      strokeWeight(3);
      fill(this.brightness + 40);
    }
    ellipse(this.x, this.y, this.r * 2);

    // Display currency code and rate in the center of the bubble
    fill(255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text(this.rate.toFixed(2), this.x, this.y + 8);

    // Conditional coloring of currency code based on rate
    if (this.rate > 1) {
      fill(0, 255, 200);
    } else {
      fill(255, 0, 100);
    }
    text(this.currencyCode, this.x, this.y - 8);
  }

  bounce() {
    if (this.x >= width || this.x <= 0) {
      this.speedX *= -1;
    }
    if (this.y >= height || this.y <= 0) {
      this.speedY *= -1;
    }
  }
}


