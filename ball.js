(function () {
  class Ball {
    constructor(id, position, speed, size, color) {
      this.id = id;
      this.position = position;
      this.speed = speed;
      this.size = size;
      this.color = color;
    }

    move() {
      this.position.x += this.speed.dx;
      this.position.y += this.speed.dy;
    }

    getInfo() {
      const { x, y } = this.position;
      const { dx, dy } = this.speed;
      return {
        id: this.id,
        size: this.size,
        color: this.color,
        position: { x, y },
        speed: { dx, dy },
      };
    }

    invertXDelta() {
      this.speed.dx = -this.speed.dx;
    }

    invertYDelta() {
      this.speed.dy = -this.speed.dy
    }

    calculateCenter() {
      const c1 = this.position.x + this.size;
      const c2 = this.position.y + this.size;
      return [c1, c2];
    }

    isInBall(ball) {
      const [x2, y2] = ball.calculateCenter();
      const [x1, y1] = this.calculateCenter();

      const r1 = Math.round(this.size / 2);
      const r2 = Math.round(ball.size / 2);

      if (Math.hypot((y2 - y1), (x2 - x1)) <= (r1 + r2)) {
        return true;
      }
      return false;
    }

    hitTheBorder(obstacle) {
      const { x: ballX, y: ballY } = this.position;
      const { height: ballHeight, width: ballWidth } = this.size;
      const { position: { x: viewX, y: viewY } } = obstacle
      const { size: { height: viewHeight, width: viewWidth } } = obstacle;

      if (ballX <= viewX || (ballX + ballWidth) >= (viewX + viewWidth)) {
        this.invertXDelta();
      }
      if (ballY <= viewY || (ballY + ballHeight) >= (viewY + viewHeight)) {
        this.invertYDelta();
      }
    }

  }

  class Paddle {
    constructor(id, position, size, speed) {
      this.id = id;
      this.position = position;
      this.size = size;
      this.speed;
    }

    moveRight() {
      this.position.x += this.speed.dx;
    }

    moveLeft() {
      this.position.x -= this.speed.dx;
    }

    withinRightBorderOf(view) {
      const newX = this.position.x + this.speed.x;
      return newX >= view.position.x;
    }

    withinLeftBorderOf(view) {
      const newX = this.position.x - this.speed.x;
      return newX <= view.position.x;
    }

    isCollidingWith(ball) {
      const ballInfo = ball.getInfo();
      const { x: paddleX, y: paddleY } = this.position;
      const { width: paddleWidth } = this.size;
      const { x: ballX, y: ballY } = ballInfo.position;
      const { height: ballHeight, width: ballWidth } = ballInfo.size;

      const midX = (ballX + ballX + ballWidth) / 2;
      const midY = (ballY + ballY + ballHeight + ballHeight) / 2;
      if (midY >= paddleY) {
        if (midX >= paddleX && midX <= (paddleX + paddleWidth)) {
          ball.invertYDelta();
        }
      }
    }
  }

  const checkCollision = (ball, paddle) => {
    const ballInfo = ball.getInfo();
    const { x: paddleX, y: paddleY } = paddle.position;
    const { width: paddleWidth } = paddle.size;
    const { x: ballX, y: ballY } = ballInfo.position;
    const { height: ballHeight, width: ballWidth } = ballInfo.size;

    const midX = (ballX + ballX + ballWidth) / 2;
    const midY = (ballY + ballY + ballHeight + ballHeight) / 2;
    if (midY >= paddleY) {
      if (midX >= paddleX && midX <= (paddleX + paddleWidth)) {
        ball.invertYDelta();
      }
    }
  }

  const createBalls = () => {
    const ball1 = new Ball('ball-1', { x: 210, y: 210 }, { dx: -3, dy: 5 }, { height: 30, width: 30 }, 'red');
    return [ball1];
  };

  const px = value => value + 'px';

  const drawBall = (ball) => {
    const {
      id,
      size: { height },
      color,
      position: { x, y },
    } = ball.getInfo();
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

  const updateBall = (ball) => {
    const { id, position: { x, y }, } = ball.getInfo();
    const ballElement = document.getElementById(id);

    ballElement.style.top = px(y);
    ballElement.style.left = px(x);
  };

  const drawView = ({ position: { x, y }, size: { width, height } }) => {
    const view = document.createElement('div');
    view.id = 'view';
    view.style.width = px(width);
    view.style.height = px(height);
    // view.style.position = 'absolute';
    view.style.top = px(x);
    view.style.left = px(y);
    view.style.border = '1px solid black';
    view.style.position = 'relative';

    document.querySelector('body').appendChild(view);
    return view;
  };

  const drawPaddle = (paddle, viewElement) => {
    const { id, size: { width, height }, position: { x, y } } = paddle;

    const paddleElement = document.createElement('div');

    paddleElement.id = id;
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
    const { y: viewY } = view.position;
    const { height: viewHeight } = view.size;

    if ((ballY + ballHeight) >= (viewY + viewHeight))
      return true;
    return false;
  }

  const movePaddleToRight = (paddle, view) => {
    const newPaddleX = paddle.position.x + paddle.speed.dx;
    const paddleWidth = paddle.size.width;
    if ((newPaddleX + paddleWidth) <= (view.position.y + view.size.width)) {
      paddle.position.x += paddle.speed.dx;
    }

    const paddleElement = document.getElementById(paddle.id);
    paddleElement.style.left = px(paddle.position.x);
  }

  const movePaddleToLeft = (paddle, view) => {
    const newPaddleX = paddle.position.x - paddle.speed.dx;
    if (newPaddleX >= view.position.x) {
      paddle.position.x -= paddle.speed.dx;
    }

    const paddleElement = document.getElementById(paddle.id);
    paddleElement.style.left = px(paddle.position.x);
  }

  const registerPaddleEvent = (paddle, view) => {

    document.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') {
        movePaddleToRight(paddle, view);
      }
      if (event.key === 'ArrowLeft') {
        movePaddleToLeft(paddle, view);
      }
    });
  }

  const main = () => {
    const view = {
      position: { x: 200, y: 200 },
      size: { width: 600, height: 600 }
    };
    const paddle = { id: 'paddle', position: { x: 200, y: 760 }, size: { width: 100, height: 40 }, speed: { dx: 25, dy: 0 } };


    const balls = createBalls();
    const viewElement = drawView(view);
    balls.forEach((ball) => drawBall(ball));

    drawPaddle(paddle, viewElement);
    registerPaddleEvent(paddle, view);

    const intervalId = setInterval(() => {
      balls.forEach((ball) => ball.move());
      balls.forEach(updateBall);
      balls.forEach((ball) => ball.hitTheBorder(view));
      balls.forEach(ball => checkCollision(ball, paddle));

      const ballsCrossed = balls.filter(
        (ball) => isCrossingBottomBorder(ball, view)
      );

      if (ballsCrossed.length > 0) {
        console.log('lost')
        clearInterval(intervalId);
      }
    }, 30);
  };

  window.onload = main;
}())