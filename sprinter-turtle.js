/* global getSvg canvas ctx animation:writable gameLoop label addResize loop drawCircle paintCircle drawLine paintRoundRect isIntersectingRectangleWithRectangle isIntersectingRectangleWithCircle getDistance generateRandomNumber generateRandomInteger */
let level = 1;
let lives = 10;
let rocketCount = 10;

const lane = {
  width: 90,
  height: 60,
  gap: 1,
  color: '#FFFFFF',
  countX: canvas.width / 90,
  countY: Math.floor(canvas.height / 60 - 1)
};

const railway = {
  backgroundColor: '#EADED6',
  middleColor: '#803300',
  color: '#800000',
  backgroundHeight: 0.8 * lane.height,
  middleHeight: 0.7 * lane.height,
  height: 0.6 * lane.height,
  middleSpace: 0.2 * lane.width,
  middleThickness: 2 * lane.gap,
  thickness: lane.gap
};

const explosion = {
  color: 'rgba(255, 55, 0, ',
  alphaDecrease: 0.02,
  size: 0.5 * lane.height,
  speed: 2,
  speedDecrease: 0.01
};

const meteor = {
  color: 'rgba(200, 200, 200, 0.5)',
  textColor: 'rgba(25, 25, 25, 0.5)',
  font: '44px Arial',
  highestDuration: 240,
  highestRadius: 1.2 * lane.height,
  lowestDuration: 120,
  lowestRadius: 0.8 * lane.height,
  probability: 0.005,
  step: 59
};

const rocket = {
  width: 0.5 * lane.width,
  lineWidth: 5,
  lineCap: 'round',
  shadowBlur: 10,
  color: '#FF0000',
  speed: 10
};

const train = {
  arcX: 0.7 * lane.width,
  arcY: 0.35 * lane.height,
  colors: ['#909090', '#C4C4C4'],
  colorStops: [0, 0.2, 0.8, 1],
  height: 0.7 * lane.height,
  highestSpeed: 1.2,
  highestWidth: 8 * lane.width,
  lowestSpeed: 0.8,
  lowestWidth: 4 * lane.width,
  probability: 0.01,
  speedIncrement: 0.2,
  speed: 4 + 0.2 * (level - 1)
};

const turtle = {
  x: canvas.width / 2 - 0.2 * lane.width,
  y: canvas.height - 0.8 * lane.height,
  width: 0.4 * lane.width,
  height: 0.8 * lane.height,
  image: document.createElement('img'),
  speedIncrement: 0.1,
  speedX: 0,
  speedY: 0,
  speed: 8 + 0.1 * (level - 1),
  touchedTop: false
};

const vehicle = {
  colors: ['ff0000', 'ff7f2a', 'ffff00', '00ff00', '00ffcc', '00ffff', '00ccff', 'ff00cc', 'ff00ff', 'cc00ff', 'e6e6e6', 'cccccc'],
  height: 0.6 * lane.height,
  highestSpeed: 1.5,
  lowestSpeed: 0.5,
  probability: 0.05,
  speedIncrement: 0.3,
  speed: 3 + 0.3 * (level - 1),
  width: 0.75 * lane.width
};

label.font = '24px Arial';
label.color = '#FFFFFF';
label.margin = 10;
label.left = 10;
label.middle = 130;
label.right = canvas.width - 300;

const lines = [];
const explosions = [];
let meteors = [];
const rockets = [];
let trains = [];
let vehicles = [];

turtle.image.src = 'images/turtle.png';
for (let i = 1; i <= lane.countY; i++) {
  if (i % 3 === 1 && i !== lane.countY) {
    for (let j = 0; j < lane.countX; j++) {
      if (j % 2 === 0) {
        lines.push({
          x: j * lane.width,
          y: i * lane.height,
          width: lane.width,
          height: lane.gap,
          color: lane.color
        });
      }
    }
  } else {
    lines.push({
      x: 0,
      y: i * lane.height,
      width: canvas.width,
      height: lane.gap,
      color: lane.color
    });
    if (i % 3 === 0) {
      lines.push({
        x: 0,
        y: i * lane.height - railway.backgroundHeight - (lane.height - railway.backgroundHeight) / 2,
        width: canvas.width,
        height: railway.backgroundHeight,
        color: railway.backgroundColor
      });
      lines.push({
        x: 0,
        y: i * lane.height - railway.height - (lane.height - railway.height) / 2,
        width: canvas.width,
        height: railway.thickness,
        color: railway.color
      });
      for (let j = 0; j < canvas.width; j += railway.middleSpace) {
        lines.push({
          x: j,
          y: i * lane.height - railway.middleHeight - (lane.height - railway.middleHeight) / 2,
          width: railway.middleThickness,
          height: railway.middleHeight,
          color: railway.middleColor
        });
      }
      lines.push({
        x: 0,
        y: i * lane.height - (lane.height - railway.height) / 2,
        width: canvas.width,
        height: railway.thickness,
        color: railway.color
      });
    }
  }
}
const backgroundCanvas = document.createElement('canvas');
backgroundCanvas.width = canvas.width;
backgroundCanvas.height = canvas.height;
const backgroundCtx = backgroundCanvas.getContext('2d');
drawLines(lines);
addResize();
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousedown', mouseDownHandler);

loop(function (frames) {
  ctx.drawImage(backgroundCanvas, 0, 0);
  ctx.drawImage(turtle.image, turtle.x, turtle.y, turtle.width, turtle.height);
  for (const e of explosions) {
    paintCircle(e.x, e.y, e.size * e.hits, explosion.color + e.alpha + ')');
  }
  if (rockets.length > 0) {
    ctx.save();
    ctx.lineWidth = rocket.lineWidth;
    ctx.lineCap = rocket.lineCap;
    ctx.shadowBlur = rocket.shadowBlur;
    ctx.shadowColor = rocket.color;
    ctx.strokeStyle = rocket.color;
    ctx.beginPath();
    for (const r of rockets) {
      drawLine(r.x, r.y, r.x + r.speedX / rocket.speed * rocket.width, r.y + r.speedY / rocket.speed * rocket.width);
    }
    ctx.stroke();
    ctx.restore();
  }
  for (const t of trains) {
    drawTrain(t);
  }
  for (const v of vehicles) {
    ctx.drawImage(v.image, v.x, v.y, vehicle.width, vehicle.height);
  }
  if (meteors.length > 0) {
    ctx.fillStyle = meteor.color;
    ctx.beginPath();
    for (const m of meteors) {
      drawCircle(m.x, m.y, m.radius);
    }
    ctx.fill();
    ctx.font = meteor.font;
    ctx.fillStyle = meteor.textColor;
    for (const m of meteors) {
      ctx.fillText(Math.ceil(m.count / meteor.step), m.x - m.radius / 4, m.y + m.radius / 4);
    }
  }
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  ctx.fillText('Level: ' + level, label.left, canvas.height - label.margin);
  ctx.fillText('Lives: ' + lives, label.middle, canvas.height - label.margin);
  ctx.fillText('Rockets: ' + rocketCount, label.right, canvas.height - label.margin);
  processExplosions(frames);
  processRockets(frames);
  processTurtle(frames);
  createMeteors();
  createTrains();
  createVehicles();
  removeMeteors(frames);
  removeTrains(frames);
  removeVehicles(frames);
});

function drawLines (lines) {
  for (const l of lines) {
    backgroundCtx.fillStyle = l.color;
    backgroundCtx.fillRect(l.x, l.y, l.width, l.height);
  }
}

function drawTrain (t) {
  const gradient = ctx.createLinearGradient(t.x, t.y, t.x, t.y + train.height);
  gradient.addColorStop(train.colorStops[0], train.colors[0]);
  gradient.addColorStop(train.colorStops[1], train.colors[1]);
  gradient.addColorStop(train.colorStops[2], train.colors[1]);
  gradient.addColorStop(train.colorStops[3], train.colors[0]);
  paintRoundRect(t.x, t.y, t.width, train.height, train.arcX, train.arcY, gradient);
}

function addExplosion (x, y, hits) {
  explosions.push({
    x,
    y,
    hits,
    alpha: 1,
    size: explosion.size,
    speed: explosion.speed
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

function processExplosions (frames) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const e = explosions[i];
    e.size += e.speed * frames;
    if (e.speed > explosion.speedDecrease * frames) {
      e.speed -= explosion.speedDecrease * frames;
    }
    if (e.alpha > explosion.alphaDecrease * frames) {
      e.alpha -= explosion.alphaDecrease * frames;
    } else {
      explosions.splice(i, 1);
    }
  }
}

function processRockets (frames) {
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    let hits = 0;
    for (let j = trains.length - 1; j >= 0; j--) {
      const t = trains[j];
      if (r.x >= t.x && r.x <= t.x + t.width && r.y >= t.y && r.y <= t.y + train.height) {
        hits++;
        trains.splice(j, 1);
      }
    }
    for (let j = vehicles.length - 1; j >= 0; j--) {
      const v = vehicles[j];
      if (r.x >= v.x && r.x <= v.x + vehicle.width && r.y >= v.y && r.y <= v.y + vehicle.height) {
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
    turtle.image.src = 'images/turtle_reverse.png';
  }
  if (turtle.touchedTop && turtle.y > lane.countY * lane.height) {
    levelUp();
    turtle.touchedTop = false;
    turtle.image.src = 'images/turtle.png';
  }
}

function createMeteors () {
  if (Math.random() < meteor.probability) {
    const radius = generateRandomNumber(meteor.lowestRadius, meteor.highestRadius);
    const x = generateRandomNumber(radius, canvas.width - radius);
    const y = generateRandomNumber(radius, lane.countY * lane.height - radius);
    for (const m of meteors) {
      if (getDistance(m, { x, y }) < m.radius + radius) {
        return;
      }
    }
    meteors.push({
      x,
      y,
      radius,
      count: generateRandomNumber(meteor.lowestDuration, meteor.highestDuration)
    });
  }
}

function createTrains () {
  if (Math.random() < train.probability) {
    let l;
    do {
      l = generateRandomInteger(lane.countY);
    } while (l % 3 !== 2);
    for (const t of trains) {
      if (t.lane === l) {
        return;
      }
    }
    const direction = Math.random() < 0.5 ? 1 : -1;
    const width = generateRandomNumber(train.lowestWidth, train.highestWidth);
    trains.push({
      x: direction === 1 ? -width : canvas.width,
      y: l * lane.height + (lane.height - train.height) / 2,
      width,
      lane: l,
      speed: direction * generateRandomNumber(train.lowestSpeed, train.highestSpeed)
    });
  }
}

function createVehicles () {
  if (Math.random() < vehicle.probability) {
    let x = -vehicle.width;
    let direction = 1;
    let l;
    do {
      l = generateRandomInteger(lane.countY);
    } while (l % 3 === 2);
    if (l % 3 === 0) {
      x = canvas.width;
      direction = -1;
    }
    for (const v of vehicles) {
      if (isIntersectingRectangleWithRectangle(v, vehicle.width, vehicle.height, { x, y: l * lane.height }, lane.width, lane.height)) {
        return;
      }
    }
    const img = document.createElement('img');
    img.src = getSvg(vehicle.colors[generateRandomInteger(vehicle.colors.length)], direction);
    vehicles.push({
      x,
      y: l * lane.height + (lane.height - vehicle.height) / 2,
      image: img,
      direction,
      lane: l,
      speed: direction * generateRandomNumber(vehicle.lowestSpeed, vehicle.highestSpeed)
    });
  }
}

function removeMeteors (frames) {
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    if (m.count > 0) {
      m.count -= frames;
    } else {
      let hits = 0;
      for (let j = trains.length - 1; j >= 0; j--) {
        const t = trains[j];
        if (isIntersectingRectangleWithCircle(t, t.width, train.height, m, m.radius)) {
          hits++;
          trains.splice(j, 1);
        }
      }
      for (let j = vehicles.length - 1; j >= 0; j--) {
        const v = vehicles[j];
        if (isIntersectingRectangleWithCircle(v, vehicle.width, vehicle.height, m, m.radius)) {
          hits++;
          vehicles.splice(j, 1);
        }
      }
      if (hits > 0) {
        addExplosion(m.x, m.y, hits);
      }
      meteors.splice(i, 1);
      if (isIntersectingRectangleWithCircle(turtle, turtle.width, turtle.height, m, m.radius)) {
        die('Meteor');
        break;
      }
    }
  }
}

function removeTrains (frames) {
  for (let i = trains.length - 1; i >= 0; i--) {
    const t = trains[i];
    t.x += t.speed * train.speed * frames;
    if (t.x < -t.width || t.x > canvas.width) {
      trains.splice(i, 1);
    } else {
      if (isIntersectingRectangleWithRectangle(t, t.width, train.height, turtle, turtle.width, turtle.height)) {
        die('Train');
        break;
      }
    }
  }
}

function removeVehicles (frames) {
  for (let i = vehicles.length - 1; i >= 0; i--) {
    const v1 = vehicles[i];
    for (const v2 of vehicles) {
      if (v1.lane === v2.lane && v1 !== v2 && isIntersectingRectangleWithRectangle(v1, vehicle.width, vehicle.height, v2, vehicle.width, vehicle.height)) {
        [v1.speed, v2.speed] = [v2.speed, v1.speed];
        if (v1.x < v2.x) {
          v1.x = v2.x - vehicle.width;
        } else {
          v2.x = v1.x - vehicle.width;
        }
      }
    }
    v1.x += v1.speed * vehicle.speed * frames;
    if (v1.x < -v1.width || v1.x > canvas.width) {
      vehicles.splice(i, 1);
    } else {
      if (isIntersectingRectangleWithRectangle(v1, vehicle.width, vehicle.height, turtle, turtle.width, turtle.height)) {
        die('Vehicle');
        break;
      }
    }
  }
}

function levelUp () {
  level++;
  train.speed += train.speedIncrement;
  turtle.speed += turtle.speedIncrement;
  vehicle.speed += vehicle.speedIncrement;
}

function die (type) {
  if (--lives >= 0) {
    window.alert(type + ' hit, you died!');
    if (lives === 0) {
      window.alert('GAME OVER!');
      window.location.reload(false);
    } else {
      window.alert('START AGAIN!');
      clear();
      reset();
    }
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
  turtle.image.src = 'images/turtle.png';
  turtle.x = canvas.width / 2 - turtle.width / 2;
  turtle.y = canvas.height - turtle.height;
}

function keyDownHandler (e) {
  if (animation !== undefined) {
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
      train.speed -= train.speedIncrement;
      turtle.speed -= turtle.speedIncrement;
      vehicle.speed -= vehicle.speedIncrement;
    }
  }
}

function keyUpHandler (e) {
  if (animation !== undefined) {
    if (e.keyCode === 87 || e.keyCode === 83) {
      turtle.speedY = 0;
    }
    if (e.keyCode === 65 || e.keyCode === 68) {
      turtle.speedX = 0;
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
    if (e.keyCode === 67) {
      clear();
    }
    if (e.keyCode === 82) {
      reset();
    }
  }
  if (e.keyCode === 80) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(gameLoop);
    } else {
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function mouseDownHandler (e) {
  if (animation !== undefined) {
    const x = e.clientX - canvas.offsetLeft - turtle.x;
    const y = e.clientY - canvas.offsetTop - turtle.y;
    const norm = Math.sqrt(x ** 2 + y ** 2);
    addRocket(x / norm * rocket.speed, y / norm * rocket.speed);
  }
}
