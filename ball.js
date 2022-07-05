(function () {

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
      this.#position.x += this.#speed.dx;
      this.#position.y += this.#speed.dy;
    }

    getInfo() {
      const { x, y } = this.#position;
      const { dx, dy } = this.#speed;
      return {
        id: this.#id,
        size: this.#size,
        color: this.#color,
        position: { x, y },
        speed: { dx, dy },
      };
    }

    invertXDelta() {
      this.#speed.dx = -this.#speed.dx;
    }

    invertYDelta() {
      this.#speed.dy = -this.#speed.dy
    }

    calculateCenter() {
      const c1 = this.#position.x + this.#size;
      const c2 = this.#position.y + this.#size;
      return [c1, c2];
    }

    hitTheBorder(view) {
      if (!view.isWithinRightBoundary(this.getInfo()) ||
        !view.isWithinLeftBoundary(this.getInfo())
      ) {
        this.invertXDelta();
      }
      if (!view.isWithinTopBoundary(this.getInfo())) {
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
      const newPaddleX = this.#position.x + this.#speed.dx;

      if (view.isWithinRightBoundary(this.getInfo()))
        this.#position.x = newPaddleX;
    }

    moveLeftIn(view) {
      const newX = this.#position.x - this.#speed.dx;

      if (view.isWithinLeftBoundary(this.getInfo()))
        this.#position.x = newX;
    }

    getInfo() {
      const { x, y } = this.#position;
      const { dx, dy } = this.#speed;
      const { height, width } = this.#size;
      return {
        id: this.#id,
        position: { x, y },
        speed: { dx, dy },
        size: { height, width }
      };
    }

    isCollidingWith(ball) {
      const ballInfo = ball.getInfo();
      const { x: paddleX, y: paddleY } = this.#position;
      const { width: paddleWidth } = this.#size;
      const { x: ballX, y: ballY } = ballInfo.position;
      const { height: ballHeight, width: ballWidth } = ballInfo.size;

      const midX = (ballX + ballX + ballWidth) / 2;
      const midY = (ballY + ballY + ballHeight + ballHeight) / 2;

      if (midY >= paddleY) {
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
      const { x, y } = this.#position;
      const { height, width } = this.#size;
      return {
        id: this.#id,
        position: { x, y },
        size: { height, width },
      };
    }

    isWithinRightBoundary(entityInfo) {
      const { x: entityX } = entityInfo.position;
      const { width: entityWidth } = entityInfo.size;

      return (entityX + entityWidth) < this.#position.x + this.#size.width;
    }

    isWithinLeftBoundary(entityInfo) {
      const { x: entityX } = entityInfo.position;
      return entityX > this.#position.x;
    }

    isWithinTopBoundary(entityInfo) {
      const { y: entityY } = entityInfo.position;

      return entityY > this.#position.y;
    }

    isWithinBottomBoundary(entityInfo) {
      const { y: entityY } = entityInfo.position;
      const { height: entityHeight } = entityInfo.size;

      return (entityY + entityHeight) < (this.#position.y + this.#size.height);
    }
  }

  const createBall = () => {
    const ball1 = new Ball('ball-1', { x: 210, y: 210 }, { dx: -3, dy: 5 }, { height: 30, width: 30 }, 'red');
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

  const isCrossingBottomBorder = (ball, view) => {
    const ballInfo = ball.getInfo();
    const { y: ballY } = ballInfo.position;
    const { height: ballHeight } = ballInfo.size;

    const viewInfo = view.getInfo();
    const { y: viewY } = viewInfo.position;
    const { height: viewHeight } = viewInfo.size;

    if ((ballY + ballHeight) >= (viewY + viewHeight))
      return true;
    return false;
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
    if (isCrossingBottomBorder(ball, view)) {
      setMessageElement();
      clearInterval(intervalId);
    }
  }

  const createView = () => {
    const viewPosition = { x: 200, y: 200 };
    const viewSize = { width: 600, height: 600 };
    return new View('view', viewPosition, viewSize);
  }

  const createPaddle = () => {
    const paddlePosition = { x: 200, y: 760 };
    const paddleSize = { width: 100, height: 5 };
    const paddleSpeed = { dx: 20, dy: 0 };
    return new Paddle('p-1', paddlePosition, paddleSize, paddleSpeed);
  }

  const updateScoreBoard = scoreboard => {
    const scoreboardElement = document.getElementById(scoreboard.id);
    scoreboardElement.innerText = scoreboard.points;
  }

  const createScoreboard = (scoreboard) => {
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

    const intervalId = setInterval(() => {
      ball.move();
      updateBall(ball);
      ball.hitTheBorder(view);

      if (paddle.isCollidingWith(ball)) {
        scoreboard.points++;
      }

      updateScoreBoard(scoreboard);

      checkIfGameOver(ball, view, intervalId);
    }, 30);
  };

  window.onload = main;
}())