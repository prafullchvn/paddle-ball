(function () {

  class Vector {
    #dx;
    #dy;
    constructor(dx, dy) {
      this.#dx = dx;
      this.#dy = dy;
    }

    modifyX(value) {
      this.#dx = value;
    }

    modifyY(value) {
      this.#dy = value;
    }

    modify(value) {
      this.modifyX(value);
      this.modifyY(value);
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

    modifyX(value) {
      this.#x = value;
    }

    modifyY(value) {
      this.#y = value;
    }

    modify(value) {
      this.modifyX(value);
      this.modifyY(value);
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

      this.#position.modifyX(x + dx);
      this.#position.modifyY(y + dy);
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
      this.#speed.modifyX(-dx);
    }

    invertYDelta() {
      const { dy } = this.#speed.getInfo();
      this.#speed.modifyY(-dy);
    }

    increaseSpeed() {
      const { dx } = this.#speed.getInfo();
      const sign = dx / Math.abs(dx);
      this.#speed.modifyX(dx + (sign * 1));
      console.log(this.#speed.getInfo());
    }

    isHittingBorder(view) {

      if (
        !view.haveWithinRightBoundary(this.getInfo()) ||
        !view.haveWithinLeftBoundary(this.getInfo())
      ) {
        this.invertXDelta();
      }
      if (!view.haveWithinTopBoundary(this.getInfo())) {
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
        this.#position.modifyX(newPaddleX);
    }

    moveLeftIn(view) {
      const { x } = this.#position.getInfo();
      const { dx } = this.#speed.getInfo();
      const newPaddleX = x - dx;

      if (view.haveWithinLeftBoundary(this.getInfo()))
        this.#position.modifyX(newPaddleX);
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
          console.log(ball.getInfo(), this.getInfo());
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

  const createBall = () => {
    const position = new Position(210, 210);
    const vector = new Vector(-3, 5);
    const size = { height: 30, width: 30 };
    const ball1 = new Ball('ball-1', position, vector, size, 'red');

    return ball1;
  };

  const drawBall = ball => {
    const { id, size: { height }, color, position: { x, y }, } = ball.getInfo();
    const ballElement = document.createElement('div');

    ballElement.id = id;
    ballElement.style.position = 'absolute';
    ballElement.style.top = px(y);
    ballElement.style.left = px(x);
    ballElement.style.width = px(height);
    ballElement.style.borderRadius = '50%';
    ballElement.style.aspectRatio = '1';
    ballElement.style.backgroundColor = color;

    document.querySelector('body').appendChild(ballElement);
  };

  const updateBall = ball => {
    const { id, position: { x, y }, } = ball.getInfo();
    const ballElement = document.getElementById(id);

    ballElement.style.top = px(y);
    ballElement.style.left = px(x);
  };

  const px = value => value + 'px';

  const drawView = view => {
    const viewElement = document.createElement('div');

    const { position: { x, y }, size: { width, height } } = view.getInfo();
    viewElement.id = 'view';
    viewElement.style.width = px(width);
    viewElement.style.height = px(height);
    viewElement.style.top = px(x);
    viewElement.style.left = px(y);
    viewElement.style.border = '1px solid black';
    viewElement.style.position = 'relative';

    document.querySelector('body').appendChild(viewElement);
    return viewElement;
  };

  const drawPaddle = paddle => {
    const paddleInfo = paddle.getInfo();

    const paddleElement = document.createElement('div');
    const { height, width } = paddleInfo.size;
    const { x, y } = paddleInfo.position;

    paddleElement.id = paddleInfo.id;
    paddleElement.style.position = 'absolute';
    paddleElement.style.width = px(width);
    paddleElement.style.height = px(height);
    paddleElement.style.top = px(y);
    paddleElement.style.left = px(x);
    paddleElement.style.border = '1px solid black';

    document.querySelector('body').appendChild(paddleElement);
  }

  const updatePaddle = paddle => {
    const paddleElement = document.getElementById(paddle.id);
    paddleElement.style.left = px(paddle.position.x);
  }

  const registerPaddleEvent = (paddle, view) => {
    document.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') {
        paddle.moveRightIn(view);
      }
      if (event.key === 'ArrowLeft') {
        paddle.moveLeftIn(view);
      }
      updatePaddle(paddle.getInfo());
    });
  }

  const setMessageElement = () => {
    const message = document.createElement('div');

    message.style.fontSize = px(40);
    message.style.display = 'block';
    message.style.position = 'absolute';
    message.style.left = px(700);
    message.style.top = px(100);

    message.innerText = 'Game Over.';

    document.querySelector('body').appendChild(message);
  }

  const checkIfGameOver = (ball, view, intervalId) => {
    const ballInfo = ball.getInfo();
    if (!view.haveWithinBottomBoundary(ballInfo)) {
      setMessageElement();
      clearInterval(intervalId);
    }
  }

  const createView = () => {
    const viewPosition = new Position(200, 200);
    const viewSize = { width: 600, height: 600 };

    return new View('view', viewPosition, viewSize);
  }

  const createPaddle = () => {
    const paddlePosition = new Position(200, 760);
    const paddleSize = { width: 100, height: 5 };
    const paddleSpeed = new Vector(20, 0);
    return new Paddle('p-1', paddlePosition, paddleSize, paddleSpeed);
  }

  const updateScoreBoard = scoreboard => {
    const scoreboardElement = document.getElementById(scoreboard.id);
    scoreboardElement.innerText = scoreboard.points;
  }

  const createScoreboard = scoreboard => {
    const scoreboardElement = document.createElement('div');

    scoreboardElement.id = scoreboard.id;
    scoreboardElement.style.fontSize = px(26);
    scoreboardElement.style.display = 'block';
    scoreboardElement.style.position = 'absolute';
    scoreboardElement.style.left = px(1000);
    scoreboardElement.style.top = px(500);

    scoreboardElement.innerText = scoreboard.points;

    document.querySelector('body').appendChild(scoreboardElement);
    return scoreboardElement;
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
      this.#ball.move(); // game method  412 - 414
      // updateBall(this.#ball);
      this.#ball.isHittingBorder(this.#view);
    }

    increaseComplexity() {
      if (this.#paddle.isCollidingWith(this.#ball)) {
        this.#scoreboard.points++;

        if (scoreboard.points % 5 === 0) {
          setTimeout(() => this.#ball.increaseSpeed(), 100);
        }
      }
    }

    isGameOver() {
      this.#view.haveWithinBottomBoundary(ballInfo);
    }

    gameInfo() {
      return {
        ball: this.#ball.getInfo(),
        view: this.#view.getInfo(),
        paddle: this.#paddle.getInfo(),
        scoreboard: this.#scoreboard
      };
    }
  }

  const main = () => {
    const view = createView();
    drawView(view);

    const paddle = createPaddle();
    drawPaddle(paddle);
    registerPaddleEvent(paddle, view);

    const ball = createBall();
    drawBall(ball);

    const scoreboard = { id: 'scoreboard', points: 0 };
    createScoreboard(scoreboard);

    // game method start game
    const intervalId = setInterval(() => {
      ball.move(); // game method  412 - 414
      updateBall(ball);
      ball.isHittingBorder(view);

      if (paddle.isCollidingWith(ball)) { // game method increaseSpeedOfBall
        scoreboard.points++;

        if (scoreboard.points % 2 === 0) {
          setTimeout(() => ball.increaseSpeed(), 100);
        }
      }

      updateScoreBoard(scoreboard); // game method
      checkIfGameOver(ball, view, intervalId); // game method
    }, 30);
  };

  window.onload = main;
}())