
class Vector {
  #dx;
  #dy;
  constructor(dx, dy) {
    this.#dx = dx;
    this.#dy = dy;
  }

  changeX(value) {
    this.#dx = value;
  }

  changeY(value) {
    this.#dy = value;
  }

  modify(value) {
    this.changeX(value);
    this.changeY(value);
  }

  getInfo() {
    return { dx: this.#dx, dy: this.#dy };
  }

  add(vector) {
    const newDx = this.#dx + vector.#dx;
    const newDy = this.#dy + vector.#dy;
    return new Vector(newDx, newDy);
  }
}

class Position {
  #x;
  #y;
  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  changeX(value) {
    this.#x = value;
  }

  changeY(value) {
    this.#y = value;
  }

  modify(value) {
    this.changeX(value);
    this.changeY(value);
  }

  getInfo() {
    return { x: this.#x, y: this.#y };
  }
}

class Ball {
  #id;
  #position;
  #speed;
  #size;
  #color;
  constructor(id, position, speed, size, color) {
    this.#id = id;
    this.#position = position;
    this.#speed = speed;
    this.#size = size;
    this.#color = color;
  }

  move() {
    const { dx, dy } = this.#speed.getInfo();
    const { x, y } = this.#position.getInfo();

    this.#position.changeX(x + dx);
    this.#position.changeY(y + dy);
  }

  getInfo() {
    const { height, width } = this.#size;

    return {
      id: this.#id,
      size: { height, width },
      color: this.#color,
      position: this.#position.getInfo(),
      speed: this.#speed.getInfo(),
    };
  }

  invertXDelta() {
    const { dx } = this.#speed.getInfo();
    this.#speed.changeX(-dx);
  }

  invertYDelta() {
    const { dy } = this.#speed.getInfo();
    this.#speed.changeY(-dy);
  }

  increaseSpeed() {
    const { dx } = this.#speed.getInfo();
    const sign = dx / Math.abs(dx);

    this.#speed.changeX(dx + (sign * 1));
  }

  isHittingBorder(view) {
    const viewInfo = this.getInfo();
    if (
      !view.haveWithinRightBoundary(viewInfo) ||
      !view.haveWithinLeftBoundary(viewInfo)
    ) {
      this.invertXDelta();
    }
    if (!view.haveWithinTopBoundary(viewInfo)) {
      this.invertYDelta();
    }
  }

}

class Paddle {
  #id;
  #position;
  #size;
  #speed;

  constructor(id, position, size, speed) {
    this.#id = id;
    this.#position = position;
    this.#size = size;
    this.#speed = speed;
  }

  moveRightIn(view) {
    const { x } = this.#position.getInfo();
    const { dx } = this.#speed.getInfo();
    const newPaddleX = x + dx;

    if (view.haveWithinRightBoundary(this.getInfo()))
      this.#position.changeX(newPaddleX);
  }

  moveLeftIn(view) {
    const { x } = this.#position.getInfo();
    const { dx } = this.#speed.getInfo();
    const newPaddleX = x - dx;

    if (view.haveWithinLeftBoundary(this.getInfo()))
      this.#position.changeX(newPaddleX);
  }

  getInfo() {
    const { height, width } = this.#size;

    return {
      id: this.#id,
      position: this.#position.getInfo(),
      speed: this.#speed.getInfo(),
      size: { height, width }
    };
  }

  isCollidingWith(ball) {
    const { x: paddleX, y: paddleY } = this.#position.getInfo();
    const { width: paddleWidth } = this.#size;

    const ballInfo = ball.getInfo();
    const { x: ballX, y: ballY } = ballInfo.position;
    const { height: ballHeight, width: ballWidth } = ballInfo.size;

    const midX = (ballX + ballX + ballWidth) / 2;
    const midY = (ballY + ballY + ballHeight + ballHeight) / 2;

    if (midY > paddleY) {
      if (midX >= paddleX && midX <= (paddleX + paddleWidth)) {
        ball.invertYDelta();
        return true;
      }
    }
    return false;
  }
}

class View {
  #id;
  #position;
  #size;
  constructor(id, position, size) {
    this.#id = id;
    this.#position = position;
    this.#size = size;
  }

  getInfo() {
    const { height, width } = this.#size;

    return {
      id: this.#id,
      position: this.#position.getInfo(),
      size: { height, width },
    };
  }

  haveWithinRightBoundary(entityInfo) {
    const { x: entityX } = entityInfo.position;
    const { width: entityWidth } = entityInfo.size;

    const { x: viewX } = this.#position.getInfo();
    const { width: viewWidth } = this.#size;

    return (entityX + entityWidth) < viewX + viewWidth;
  }

  haveWithinLeftBoundary(entityInfo) {
    const { x: entityX } = entityInfo.position;
    const { x: viewX } = this.#position.getInfo();

    return entityX > viewX;
  }

  haveWithinTopBoundary(entityInfo) {
    const { y: entityY } = entityInfo.position;
    const { y: viewY } = this.#position.getInfo();

    return entityY > viewY;
  }

  haveWithinBottomBoundary(entityInfo) {
    const { y: entityY } = entityInfo.position;
    const { height: entityHeight } = entityInfo.size;

    const { y: viewY } = this.#position.getInfo();
    const { height: viewHeight } = this.#size;

    return (entityY + entityHeight) < (viewY + viewHeight);
  }
}

class Scoreboard {
  #points;
  #id;
  constructor(id, points) {
    this.#id = id;
    this.#points = points;
  }

  increaseScore() {
    this.#points ++;
  }

  getInfo() {
    return {
      id: this.#id,
      points: this.#points,
    };
  }
}

class Game {
  #view;
  #paddle;
  #ball;
  #scoreboard;
  constructor(view, paddle, ball, scoreboard) {
    this.#view = view;
    this.#paddle = paddle;
    this.#ball = ball;
    this.#scoreboard = scoreboard;
  }

  start() {
    this.#ball.move();
    this.#ball.isHittingBorder(this.#view);
  }

  #increaseBallSpeed() {
    const currentScore = this.#scoreboard.getInfo().points;
    if (currentScore % 5 === 0) {
      setTimeout(() => this.#ball.increaseSpeed(), 100);
    }
  }

  updateScore() {
    if (this.#paddle.isCollidingWith(this.#ball)) {
      this.#scoreboard.increaseScore();
      this.#increaseBallSpeed();
    }
  }

  isGameOver() {
    return !this.#view.haveWithinBottomBoundary(this.#ball.getInfo());
  }

  getInfo() {
    return {
      ball: this.#ball.getInfo(),
      view: this.#view.getInfo(),
      paddle: this.#paddle.getInfo(),
      scoreboard: this.#scoreboard.getInfo()
    };
  }
}
