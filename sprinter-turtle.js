let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let laneHeight = 40;
let lanes = Math.floor(canvas.height / laneHeight - 1);
let lineWidth = 60;
let lines = canvas.width / lineWidth;
let laneGapHeight = 0.01 * laneHeight;
let labelSize = 0.8 * laneHeight;
let pixelsPerFrame = 0.6;
let deathBehavior = false;
let laneColor = "#FFFFFF";
let level = 1;
let lives = 10;
let rocket_count = 10;

let background = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  color: "#444444"
};

let explosion = {
  color: "rgba(255, 40, 0, 0.5)",
  duration: 2 * laneHeight,
  increment: 4,
  radius: 0.5 * laneHeight
};

let meteor = {
  alpha: 0.5,
  duration: 150,
  font: "44px Arial",
  highestRadius: 1.2 * laneHeight,
  lowestRadius: 0.8 * laneHeight,
  probability: 0.005,
  step: 30
};

let rocket = {
  radius: 0.4 * laneHeight,
  speed: 20 * pixelsPerFrame
};

let train = {
  color: "#FF0000",
  duration: 150,
  height: 0.1 * laneHeight,
  lanes: Math.floor(lanes / 2),
  probability: 0.005,
  warningColor: "#FFD700",
  warningDuration: 50,
  width: canvas.width
};

let turtle = {
  color: "#008000",
  maxTurn: 45,
  radius: 0.4 * laneHeight,
  speedIncrement: 0.2,
  speedX: 0,
  speedY: 0,
  speed: (15 + 0.2 * (level - 1)) * pixelsPerFrame,
  touchedTop: false,
  turn: 10 * pixelsPerFrame,
  x: canvas.width / 2 - 0.4 * laneHeight,
  y: canvas.height - 0.4 * laneHeight
};

let vehicle = {
  height: 0.6 * laneHeight,
  arc: 0.3 * laneHeight,
  highestArc: 1.2,
  highestHeight: 1.2,
  highestSpeed: 1.5,
  highestWidth: 1.2,
  longProbability: 0.1,
  longWidthMultiplier: 2,
  lowestArc: 0.8,
  lowestHeight: 0.8,
  lowestSpeed: 0.5,
  lowestWidth: 0.8,
  probability: 0.05,
  speedIncrement: 0.5,
  speed: (5 + 0.5 * (level - 1)) * pixelsPerFrame,
  width: 1 * lineWidth
};

let label = {
  font: "24px Arial",
  color: "#FFFFFF",
  margin: 10
};

let continuousLanes = [];
let fragmentedLanes = [];
let explosions = [];
let meteors = [];
let rockets = [];
let trains = [];
let vehicles = [];

for (let i = 0; i < lanes - lanes / 2; i++) {
  if (i !== Math.floor(lanes / 2)) {
    continuousLanes.push({
      x: 0,
      y: 2 * (i + 1) * laneHeight - laneGapHeight / 2,
      width: canvas.width,
      height: laneGapHeight,
      color: laneColor
    });
  } else {
    continuousLanes.push({
      x: 0,
      y: (2 * i + 1) * laneHeight - laneGapHeight / 2,
      width: canvas.width,
      height: laneGapHeight,
      color: laneColor
    });
  }
}
for (let i = 0; i < Math.floor(lanes / 2); i++) {
  for (let j = 0; j < lines; j++) {
    if (j % 2 === 0) {
      fragmentedLanes.push({
        x: j * lineWidth,
        y: (2 * i + 1) * laneHeight - laneGapHeight / 2,
        width: lineWidth,
        height: laneGapHeight,
        color: laneColor
      });
    }
  }
}
for (let i = 0; i < train.lanes; i++) {
  trains.push({
    x: 0,
    y: 2 * (i + 1) * laneHeight - train.height / 2,
    count: 0,
    usage: false,
    warningCount: 0,
    width: train.width,
    height: train.height
  })
}
draw();
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousedown", mouseDownHandler);
window.addEventListener("resize", resizeHandler);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(background);
  drawLanes(continuousLanes);
  drawLanes(fragmentedLanes);
  drawCircle(turtle.x, turtle.y, turtle.radius, turtle.color);
  for (let e of explosions) {
    drawCircle(e.x, e.y, e.radius + e.count, explosion.color);
  }
  for (let m of meteors) {
    drawMeteor(m);
  }
  for (let r of rockets) {
    drawCircle(r.x, r.y, r.radius, r.color);
  }
  for (let t of trains) {
    if (t.usage) {
      drawRect(t);
    }
  }
  for (let v of vehicles) {
    drawVehicle(v);
  }
  drawLabel(label.font, label.color, "Level: " + level, 10, canvas.height - label.margin);
  drawLabel(label.font, label.color, "Lives: " + lives, canvas.width - 270, canvas.height - label.margin);
  drawLabel(label.font, label.color, "Rockets: " + rocket_count, canvas.width - 140, canvas.height - label.margin);
  processExplosions();
  processRockets();
  processTurtle();
  createMeteors();
  createTrains();
  createVehicles();
  removeMeteors();
  removeTrains();
  removeVehicles();
  requestAnimationFrame(draw);
}

function drawRect(r) {
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.width, r.height);
  fill(r.color);
}

function drawLanes(lanes) {
  for (let l of lanes) {
    drawRect(l);
  }
}

function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  fill(color);
}

function drawMeteor(m) {
  drawCircle(m.x, m.y, m.radius, m.color);
  drawLabel(meteor.font, m.color_invert, Math.floor(m.count / meteor.step), m.x - m.radius / 3, m.y + m.radius / 3);
}

function drawVehicle(v) {
  ctx.beginPath();
  ctx.moveTo(v.x + v.arc, v.y);
  ctx.lineTo(v.x + v.width - v.arc, v.y);
  ctx.quadraticCurveTo(v.x + v.width, v.y, v.x + v.width, v.y + v.arc);
  ctx.lineTo(v.x + v.width, v.y + v.height - v.arc);
  ctx.quadraticCurveTo(v.x + v.width, v.y + v.height, v.x + v.width - v.arc, v.y + v.height);
  ctx.lineTo(v.x + v.arc, v.y + v.height);
  ctx.quadraticCurveTo(v.x, v.y + v.height, v.x, v.y + v.height - v.arc);
  ctx.lineTo(v.x, v.y + v.arc);
  ctx.quadraticCurveTo(v.x, v.y, v.x + v.arc, v.y);
  fill(v.color);
}

function drawLabel(font, color, text, x, y) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function fill(color) {
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function addExplosion(o) {
  let hits = 0;
  for (let i = vehicles.length - 1; i >= 0; i--) {
    let v = vehicles[i];
    if (rect_and_circle(v, o)) {
      hits++;
      vehicles.splice(i, 1);
    }
  }
  for (let t of trains) {
    if (t.usage && t.count !== 0 && rect_and_circle(t, o)) {
      hits++;
      t.count = 0;
      t.usage = false;
    }
  }
  if (hits > 0) {
    explosions.push({
      x: o.x,
      y: o.y,
      radius: explosion.radius * hits,
      count: 1
    });
  }
  return hits > 0;
}

function addRocket(speedX, speedY) {
  if (rocket_count > 0) {
    rocket_count--;
    rockets.push({
      x: turtle.x,
      y: turtle.y,
      speedX,
      speedY,
      radius: rocket.radius,
      color: generateRandomHexColor()
    });
  }
}

function processExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    let e = explosions[i];
    e.count += explosion.increment;
    if (e.count >= explosion.duration) {
      explosions.splice(i, 1);
    }
  }
}

function processRockets() {
  for (let i = rockets.length - 1; i >= 0; i--) {
    let r = rockets[i];
    if (addExplosion(r)) {
      rockets.splice(i, 1);
    } else {
      let dX = r.x + r.speedX;
      let dY = r.y + r.speedY;
      if (dX < 0 || dX > canvas.width || dY < 0 || dY > canvas.height) {
        rockets.splice(i, 1);
      } else {
        r.x = dX;
        r.y = dY;
      }
    }
  }
}

function processTurtle() {
  if ((turtle.speedX === turtle.speed && turtle.speedY === turtle.speed) || (turtle.speedX === turtle.speed && turtle.speedY === -turtle.speed) || (turtle.speedX === -turtle.speed && turtle.speedY === turtle.speed) || (turtle.speedX === -turtle.speed && turtle.speedY === -turtle.speed)) {
    turtle.speedX /= Math.sqrt(2);
    turtle.speedY /= Math.sqrt(2);
  }
  let dX = turtle.x + turtle.speedX;
  let dY = turtle.y + turtle.speedY;
  if (turtle.y - turtle.radius < 0) {
    dY = turtle.y + 1;
  }
  if (turtle.y + turtle.radius > canvas.height) {
    dY = turtle.y - 1;
  }
  if (turtle.x - turtle.radius < 0) {
    dX = turtle.x + 1;
  }
  if (turtle.x + turtle.radius > canvas.width) {
    dX = turtle.x - 1;
  }
  turtle.x = dX;
  turtle.y = dY;
  let top = turtle.y - turtle.radius;
  if (!turtle.touchedTop && top < 1) {
    turtle.touchedTop = true;
  }
  if (turtle.touchedTop && top > lanes * laneHeight) {
    level++;
    turtle.touchedTop = false;
    turtle.speed += turtle.speedIncrement * pixelsPerFrame;
    vehicle.speed += vehicle.speedIncrement * pixelsPerFrame;
  }
}

function createMeteors() {
  if (Math.random() < meteor.probability) {
    let color = generateRandomRgbColor();
    let radius = Math.floor(meteor.lowestRadius + Math.random() * (meteor.highestRadius - meteor.lowestRadius));
    meteors.push({
      x: Math.floor(Math.random() * (canvas.width - radius)),
      y: Math.floor(Math.random() * (lanes * laneHeight - radius)),
      radius,
      count: meteor.duration,
      color: "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + meteor.alpha + ")",
      color_invert: "rgba(" + (255 - color[0]) + ", " + (255 - color[1]) + ", " + (255 - color[2]) + ", " + meteor.alpha + ")"
    });
  }
}

function createTrains() {
  if (Math.random() < train.probability) {
    let lane = Math.floor(Math.random() * train.lanes);
    if (!trains[lane].usage) {
      trains[lane].usage = true;
      trains[lane].warningCount = 1;
      trains[lane].color = train.warningColor;
    }
  }
}

function createVehicles() {
  if (Math.random() < vehicle.probability) {
    let height = vehicle.height * ((vehicle.highestHeight - vehicle.lowestHeight) * Math.random() + vehicle.lowestHeight);
    let width = vehicle.width * ((vehicle.highestWidth - vehicle.lowestWidth) * Math.random() + vehicle.lowestWidth);
    if (Math.random() < vehicle.longProbability) {
      width *= vehicle.longWidthMultiplier;
    }
    let x = -width;
    let direction = 1;
    if (Math.random() < 0.5) {
      x = canvas.width;
      direction = -1;
    }
    let lans = {};
    for (let v of vehicles) {
      if (rect_and_rect(v.x, v.y, v.width, v.height, x, 0, width, canvas.height)) {
        lans[v.lane] = true;
      }
    }
    let lane = Math.floor(Math.random() * lanes);
    if (lans[lane] === undefined) {
      vehicles.push({
        x,
        y: lane * laneHeight + (laneHeight - height) / 2,
        width,
        height,
        direction,
        lane,
        arc: vehicle.arc * ((vehicle.highestArc - vehicle.lowestArc) * Math.random() + vehicle.lowestArc),
        speed: direction * ((vehicle.highestSpeed - vehicle.lowestSpeed) * Math.random() + vehicle.lowestSpeed),
        color: generateRandomHexColor()
      });
    }
  }
}

function removeMeteors() {
  for (let i = meteors.length - 1; i >= 0; i--) {
    let m = meteors[i];
    if (m.count !== 0) {
      m.count--;
    } else {
      meteors.splice(i, 1);
      addExplosion(m);
      dieM(m);
    }
  }
}

function removeTrains() {
  for (let t of trains) {
    if (t.usage) {
      if (t.warningCount !== 0) {
        if (t.warningCount < train.warningDuration) {
          t.warningCount++;
        } else {
          t.count = 1;
          t.warningCount = 0;
          t.color = train.color;
        }
      }
      if (t.count !== 0) {
        if (t.count < train.duration) {
          t.count++;
          dieTV("Train", t);
        } else {
          t.count = 0;
          t.usage = false;
        }
      }
    }
  }
}

function removeVehicles() {
  for (let i = vehicles.length - 1; i >= 0; i--) {
    let v1 = vehicles[i];
    for (let v2 of vehicles) {
      if (v1 !== v2 && rect_and_rect(v1.x, v1.y, v1.width, v1.height, v2.x, v2.y, v2.width, v2.height)) {
        let s = v1.speed;
        v1.speed = v2.speed;
        v2.speed = s;
      }
    }
    let d = v1.x + v1.speed * vehicle.speed;
    if (d < -v1.width || d > canvas.width) {
      vehicles.splice(i, 1);
    } else {
      v1.x = d;
      dieTV("Vehicle", v1);
    }
  }
}

function generateRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function generateRandomRgbColor() {
  return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
}

function rect_and_rect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

function rect_and_circle(r, c) {
  let distX = Math.abs(c.x - r.x - r.width / 2);
  let distY = Math.abs(c.y - r.y - r.height / 2);
  if (distX > (r.width / 2 + c.radius) || distY > (r.height / 2 + c.radius)) {
    return false;
  }
  if (distX <= (r.width / 2) || distY <= (r.height / 2)) {
    return true;
  }
  let dx = distX - r.width / 2;
  let dy = distY - r.height / 2;
  return (dx * dx + dy * dy <= (c.radius * c.radius));
}

function circle_and_circle(c1, c2) {
  let dx = c1.x - c2.x;
  let dy = c1.y - c2.y;
  return Math.sqrt(dx * dx + dy * dy) < c1.radius + c2.radius;
}

function dieTV(type, o) {
  if (rect_and_circle(o, turtle)) {
    die(type);
  }
}

function dieM(m) {
  if (circle_and_circle(m, turtle)) {
    die("Meteor");
  }
}

function die(type) {
  alert(type + " hit, you died!");
  if (--lives === 0) {
    alert("GAME OVER!");
    document.location.reload();
  } else {
    alert("START AGAIN!");
    turtle.speedX = 0;
    turtle.speedY = 0;
    turtle.touchedTop = false;
    turtle.x = canvas.width / 2 - 0.4 * laneHeight;
    turtle.y = canvas.height - 0.4 * laneHeight;
  }
}

function keyDownHandler(e) {
  if (e.keyCode === 87) {
    turtle.speedY = -turtle.speed;
  }
  if (e.keyCode === 83) {
    turtle.speedY = turtle.speed;
  }
  if (e.keyCode === 65) {
    turtle.speedX = -turtle.speed;
  }
  if (e.keyCode === 68) {
    turtle.speedX = turtle.speed;
  }
  if (e.keyCode === 38) {
    addRocket(0, -rocket.speed);
  }
  if (e.keyCode === 40) {
    addRocket(0, rocket.speed);
  }
  if (e.keyCode === 37) {
    addRocket(-rocket.speed, 0);
  }
  if (e.keyCode === 39) {
    addRocket(rocket.speed, 0);
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 87 || e.keyCode === 83) {
    turtle.speedY = 0;
  }
  if (e.keyCode === 65 || e.keyCode === 68) {
    turtle.speedX = 0;
  }
}

function mouseDownHandler(e) {
  let x = e.clientX - canvas.offsetLeft - turtle.x;
  let y = e.clientY - canvas.offsetTop - turtle.y;
  let norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  addRocket(x / norm * rocket.speed, y / norm * rocket.speed);
}

function resizeHandler() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
