/* global performance */
/* global FPSMeter */
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const getTime = typeof performance === 'function' ? performance.now : Date.now;
const FRAME_DURATION = 1000 / 58;
let then = getTime();
let acc = 0;
let meter = new FPSMeter({
  left: canvas.width - 140 + 'px',
  top: 'auto',
  bottom: '12px',
  theme: 'transparent',
  heat: 1,
  graph: 1
});

let level = 1;
let lives = 10;
let rocketCount = 10;

let lane = {
  width: 90,
  height: 60,
  gap: 1,
  color: '#FFFFFF',
  countX: canvas.width / 90,
  countY: Math.floor(canvas.height / 60 - 1)
};

let explosion = {
  color: 'rgba(255, 55, 0, 0.5)',
  duration: 1000,
  growth: 2,
  radius: 0.5 * lane.height,
  step: 12.5
};

let meteor = {
  alpha: 0.5,
  font: '44px Arial',
  highestDuration: 4000,
  highestRadius: 1.2 * lane.height,
  lowestDuration: 2000,
  lowestRadius: 0.8 * lane.height,
  probability: 0.005,
  step: 1000
};

let rocket = {
  width: lane.width / 2,
  lineWidth: 5,
  lineCap: 'round',
  shadowBlur: 10,
  color: '#FF0000',
  speed: 10
};

let train = {
  color: '#FF0000',
  duration: 3000,
  height: 0.1 * lane.height,
  lanes: Math.floor(lane.countY / 2),
  minWidth: 4 * lane.width,
  probability: 0.01,
  warningColor: '#FFD700',
  warningDuration: 1000
};

let turtle = {
  x: canvas.width / 2 - 0.19 * lane.width,
  y: canvas.height - 0.8 * lane.height,
  width: 0.38 * lane.width,
  height: 0.8 * lane.height,
  image: document.createElement('img'),
  speedIncrement: 0.1,
  speedX: 0,
  speedY: 0,
  speed: 8 + 0.1 * (level - 1),
  touchedTop: false
};

let vehicle = {
  highestArc: 0.36 * lane.height,
  highestHeight: 0.7 * lane.height,
  highestSpeed: 1.5,
  highestWidth: 1.2 * lane.width,
  longProbability: 0.1,
  longWidthMultiplier: 3,
  lowestArc: 0.24 * lane.height,
  lowestHeight: 0.5 * lane.height,
  lowestSpeed: 0.5,
  lowestWidth: 0.8 * lane.width,
  probability: 0.05,
  speedIncrement: 0.3,
  speed: 3 + 0.3 * (level - 1)
};

let label = {
  font: '24px Arial',
  color: '#FFFFFF',
  margin: 10
};

let continuousLanes = [];
let discreteLanes = [];
let explosions = [];
let meteors = [];
let rockets = [];
let trains = [];
let vehicles = [];

turtle.image.src = 'turtle.png';
for (let i = 0; i < lane.countY - lane.countY / 2; i++) {
  if (i !== Math.floor(lane.countY / 2)) {
    continuousLanes.push({
      x: 0,
      y: 2 * (i + 1) * lane.height - lane.gap / 2
    });
  } else {
    continuousLanes.push({
      x: 0,
      y: (2 * i + 1) * lane.height - lane.gap / 2
    });
  }
}
for (let i = 0; i < Math.floor(lane.countY / 2); i++) {
  for (let j = 0; j < lane.countX; j++) {
    if (j % 2 === 0) {
      discreteLanes.push({
        x: j * lane.width,
        y: (2 * i + 1) * lane.height - lane.gap / 2
      });
    }
  }
}
let backgroundCanvas = document.createElement('canvas');
backgroundCanvas.width = canvas.width;
backgroundCanvas.height = canvas.height;
let backgroundCtx = backgroundCanvas.getContext('2d');
backgroundCtx.fillStyle = lane.color;
drawLanes(continuousLanes, canvas.width);
drawLanes(discreteLanes, lane.width);
draw();
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousedown', mouseDownHandler);
window.addEventListener('resize', resizeHandler);

function drawLanes (lanes, width) {
  for (let l of lanes) {
    backgroundCtx.fillRect(l.x, l.y, width, lane.gap);
  }
}

function draw () {
  let now = getTime();
  let ms = now - then;
  let frames = 0;
  then = now;
  if (ms < 1000) {
    acc += ms;
    while (acc >= FRAME_DURATION) {
      frames++;
      acc -= FRAME_DURATION;
    }
  } else {
    ms = 0;
  }
  meter.tick();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundCanvas, 0, 0);
  ctx.drawImage(turtle.image, turtle.x, turtle.y, turtle.width, turtle.height);
  for (let e of explosions) {
    drawCircle(e.x, e.y, e.radius + e.count / explosion.step, explosion.color);
  }
  for (let m of meteors) {
    drawMeteor(m);
  }
  ctx.save();
  ctx.lineWidth = rocket.lineWidth;
  ctx.lineCap = rocket.lineCap;
  ctx.shadowBlur = rocket.shadowBlur;
  ctx.shadowColor = rocket.color;
  ctx.strokeStyle = rocket.color;
  for (let r of rockets) {
    drawRocket(r);
  }
  ctx.restore();
  for (let t of trains) {
    drawTrain(t);
  }
  for (let v of vehicles) {
    drawVehicle(v);
  }
  drawLabel(label.font, label.color, 'Level: ' + level, 10, canvas.height - label.margin);
  drawLabel(label.font, label.color, 'Lives: ' + lives, 130, canvas.height - label.margin);
  drawLabel(label.font, label.color, 'Rockets: ' + rocketCount, canvas.width - 300, canvas.height - label.margin);
  processExplosions(ms);
  processRockets(frames);
  processTurtle(frames);
  createMeteors();
  createTrains();
  createVehicles();
  removeMeteors(ms);
  removeTrains(ms);
  removeVehicles(frames);
  window.requestAnimationFrame(draw);
}

function drawCircle (x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  fill(color);
}

function drawMeteor (m) {
  drawCircle(m.x, m.y, m.radius, m.color);
  drawLabel(meteor.font, m.colorInverted, Math.ceil(m.count / meteor.step), m.x - m.radius / 4, m.y + m.radius / 4);
}

function drawRocket (r) {
  ctx.beginPath();
  ctx.moveTo(r.x, r.y);
  ctx.lineTo(r.x + r.speedX / rocket.speed * rocket.width, r.y + r.speedY / rocket.speed * rocket.width);
  ctx.stroke();
  ctx.closePath();
}

function drawTrain (t) {
  ctx.fillStyle = t.warningCount !== 0 ? train.warningColor : train.color;
  ctx.fillRect(t.x, t.y, t.width, train.height);
}

function drawVehicle (v) {
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

function drawLabel (font, color, text, x, y) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function fill (color) {
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function addExplosion (x, y, hits) {
  explosions.push({
    x,
    y,
    radius: explosion.radius * hits,
    count: 1
  });
}

function addRocket (speedX, speedY) {
  if (rocketCount > 0) {
    rocketCount--;
    rockets.push({
      x: turtle.x + turtle.width / 2,
      y: turtle.y + turtle.height / 2,
      speedX,
      speedY
    });
  }
}

function processExplosions (ms) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    let e = explosions[i];
    e.count += explosion.growth * ms;
    if (e.count > explosion.duration) {
      explosions.splice(i, 1);
    }
  }
}

function processRockets (frames) {
  for (let i = rockets.length - 1; i >= 0; i--) {
    let r = rockets[i];
    let hits = 0;
    for (let j = trains.length - 1; j >= 0; j--) {
      let t = trains[j];
      if (t.count !== 0 && r.x >= t.x && r.x <= t.x + t.width && r.y >= t.y && r.y <= t.y + train.height) {
        hits++;
        trains.splice(j, 1);
      }
    }
    for (let j = vehicles.length - 1; j >= 0; j--) {
      let v = vehicles[j];
      if (r.x >= v.x && r.x <= v.x + v.width && r.y >= v.y && r.y <= v.y + v.height) {
        hits++;
        vehicles.splice(j, 1);
      }
    }
    if (hits > 0) {
      rockets.splice(i, 1);
      addExplosion(r.x, r.y, hits);
    } else {
      if (r.x < r.radius || r.x > canvas.width - r.radius || r.y < r.radius || r.y > canvas.height - r.radius) {
        rockets.splice(i, 1);
      } else {
        r.x += r.speedX * frames;
        r.y += r.speedY * frames;
      }
    }
  }
}

function processTurtle (frames) {
  if ((turtle.speedX === turtle.speed && turtle.speedY === turtle.speed) || (turtle.speedX === turtle.speed && turtle.speedY === -turtle.speed) || (turtle.speedX === -turtle.speed && turtle.speedY === turtle.speed) || (turtle.speedX === -turtle.speed && turtle.speedY === -turtle.speed)) {
    turtle.speedX /= Math.sqrt(2);
    turtle.speedY /= Math.sqrt(2);
  }
  let dX = turtle.speedX * frames;
  let dY = turtle.speedY * frames;
  if (turtle.y < 0) {
    dY = 1;
  }
  if (turtle.y + turtle.height > canvas.height) {
    dY = -1;
  }
  if (turtle.x < 0) {
    dX = 1;
  }
  if (turtle.x + turtle.width > canvas.width) {
    dX = -1;
  }
  turtle.x += dX;
  turtle.y += dY;
  if (!turtle.touchedTop && turtle.y < 1) {
    turtle.touchedTop = true;
    turtle.image.src = 'turtle_reverse.png';
  }
  if (turtle.touchedTop && turtle.y > lane.countY * lane.height) {
    levelUp();
    turtle.touchedTop = false;
    turtle.image.src = 'turtle.png';
  }
}

function createMeteors () {
  if (Math.random() < meteor.probability) {
    let radius = Math.floor(meteor.lowestRadius + Math.random() * (meteor.highestRadius - meteor.lowestRadius));
    let x = Math.floor(radius + Math.random() * (canvas.width - 2 * radius));
    let y = Math.floor(radius + Math.random() * (lane.countY * lane.height - 2 * radius));
    for (let m of meteors) {
      if (circleCircle(m.x, m.y, m.radius, x, y, radius)) {
        return;
      }
    }
    let c = generateRandomRgbColor();
    meteors.push({
      x,
      y,
      radius,
      color: 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + meteor.alpha + ')',
      colorInverted: 'rgba(' + (255 - c[0]) + ', ' + (255 - c[1]) + ', ' + (255 - c[2]) + ', ' + meteor.alpha + ')',
      count: Math.floor(meteor.lowestDuration + Math.random() * (meteor.highestDuration - meteor.lowestDuration))
    });
  }
}

function createTrains () {
  if (Math.random() < train.probability) {
    let x = Math.floor(Math.random() * (canvas.width - train.minWidth));
    let y = 2 * Math.ceil(Math.random() * train.lanes) * lane.height - train.height / 2;
    let width = train.minWidth + Math.floor(Math.random() * (canvas.width - train.minWidth - x));
    for (let t of trains) {
      if (t.y === y && ((t.x >= x && t.x <= x + width) || (t.x + t.width >= x && t.x + t.width <= x + width) ||
          (x >= t.x && x <= t.x + t.width) || (x + width >= t.x && x + width <= t.x + t.width))) {
        return;
      }
    }
    trains.push({
      x,
      y,
      width,
      count: 0,
      warningCount: 1
    });
  }
}

function createVehicles () {
  if (Math.random() < vehicle.probability) {
    let height = vehicle.lowestHeight + Math.random() * (vehicle.highestHeight - vehicle.lowestHeight);
    let width = vehicle.lowestWidth + Math.random() * (vehicle.highestWidth - vehicle.lowestWidth);
    if (Math.random() < vehicle.longProbability) {
      width *= vehicle.longWidthMultiplier;
    }
    let x = -width;
    let direction = 1;
    let test = -vehicle.longWidthMultiplier * vehicle.highestWidth;
    if (Math.random() < 0.5) {
      x = canvas.width;
      direction = -1;
      test = canvas.width;
    }
    let l = Math.floor(Math.random() * lane.countY);
    for (let v of vehicles) {
      if (rectRect(v.x, v.y, v.width, v.height, test, l * lane.height, vehicle.longWidthMultiplier * vehicle.highestWidth, lane.height)) {
        return;
      }
    }
    vehicles.push({
      x,
      y: l * lane.height + (lane.height - height) / 2,
      width,
      height,
      arc: vehicle.lowestArc + Math.random() * (vehicle.highestArc - vehicle.lowestArc),
      color: generateRandomHexColor(),
      direction,
      lane: l,
      speed: direction * (vehicle.lowestSpeed + Math.random() * (vehicle.highestSpeed - vehicle.lowestSpeed))
    });
  }
}

function removeMeteors (ms) {
  for (let i = meteors.length - 1; i >= 0; i--) {
    let m = meteors[i];
    if (m.count > 0) {
      m.count -= ms;
    } else {
      let hits = 0;
      for (let j = trains.length - 1; j >= 0; j--) {
        let t = trains[j];
        if (t.count !== 0 && rectCircle(t, m)) {
          hits++;
          trains.splice(j, 1);
        }
      }
      for (let j = vehicles.length - 1; j >= 0; j--) {
        let v = vehicles[j];
        if (rectCircle(v, m)) {
          hits++;
          vehicles.splice(j, 1);
        }
      }
      if (hits > 0) {
        addExplosion(m.x, m.y, hits);
      }
      meteors.splice(i, 1);
      if (rectCircle(turtle, m)) {
        die('Meteor');
        break;
      }
    }
  }
}

function removeTrains (ms) {
  for (let i = trains.length - 1; i >= 0; i--) {
    let t = trains[i];
    if (t.warningCount !== 0) {
      if (t.warningCount < train.warningDuration) {
        t.warningCount += ms;
      } else {
        t.count = 1;
        t.warningCount = 0;
      }
    } else {
      if (t.count < train.duration) {
        t.count += ms;
        if (rectRect(t.x, t.y, t.width, train.height, turtle.x, turtle.y, turtle.width, turtle.height)) {
          die('Train');
          break;
        }
      } else {
        trains.splice(i, 1);
      }
    }
  }
}

function removeVehicles (frames) {
  for (let i = vehicles.length - 1; i >= 0; i--) {
    let v1 = vehicles[i];
    for (let v2 of vehicles) {
      if (v1.lane === v2.lane && v1 !== v2 && rectRect(v1.x, v1.y, v1.width, v1.height, v2.x, v2.y, v2.width, v2.height)) {
        [v1.speed, v2.speed] = [v2.speed, v1.speed];
        if (v1.x < v2.x) {
          v1.x = v2.x - v1.width;
        } else {
          v2.x = v1.x - v2.width;
        }
      }
    }
    let d = v1.x + v1.speed * vehicle.speed * frames;
    if (d < -v1.width || d > canvas.width) {
      vehicles.splice(i, 1);
    } else {
      v1.x = d;
      if (rectRect(v1.x, v1.y, v1.width, v1.height, turtle.x, turtle.y, turtle.width, turtle.height)) {
        die('Vehicle');
        break;
      }
    }
  }
}

function generateRandomHexColor () {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function generateRandomRgbColor () {
  return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
}

function rectRect (x1, y1, w1, h1, x2, y2, w2, h2) {
  return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

function rectCircle (r, c) {
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

function circleCircle (x1, y1, r1, x2, y2, r2) {
  let dx = x1 - x2;
  let dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy) < r1 + r2;
}

function levelUp () {
  level++;
  turtle.speed += turtle.speedIncrement;
  vehicle.speed += vehicle.speedIncrement;
}

function die (type) {
  window.alert(type + ' hit, you died!');
  if (--lives === 0) {
    window.alert('GAME OVER!');
    document.location.reload();
  } else {
    window.alert('START AGAIN!');
    clear();
    reset();
  }
}

function clear () {
  meteors = [];
  trains = [];
  vehicles = [];
}

function reset () {
  turtle.speedX = 0;
  turtle.speedY = 0;
  turtle.touchedTop = false;
  turtle.image.src = 'turtle.png';
  turtle.x = canvas.width / 2 - turtle.width / 2;
  turtle.y = canvas.height - turtle.height;
}

function keyDownHandler (e) {
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
  if (e.keyCode === 79) {
    levelUp();
  }
  if (e.keyCode === 76) {
    level--;
    turtle.speed -= turtle.speedIncrement;
    vehicle.speed -= vehicle.speedIncrement;
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 87 || e.keyCode === 83) {
    turtle.speedY = 0;
  }
  if (e.keyCode === 65 || e.keyCode === 68) {
    turtle.speedX = 0;
  }
  if (e.keyCode === 67) {
    clear();
  }
  if (e.keyCode === 82) {
    reset();
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

function mouseDownHandler (e) {
  let x = e.clientX - canvas.offsetLeft - turtle.x;
  let y = e.clientY - canvas.offsetTop - turtle.y;
  let norm = Math.sqrt(x ** 2 + y ** 2);
  addRocket(x / norm * rocket.speed, y / norm * rocket.speed);
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
