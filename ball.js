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

    hitTheBorder({ height, width }) {
      const { x, y } = this.position;
      if (x > width - this.size || x < 0) this.invertXDelta();
      if (y > height - this.size || y < 0) this.invertYDelta();
    }
  }

  class Paddle {
    constructor(id, size, position, dx) {
      this.id = id;
      this.size = size;
      this.position = position;
      this.dx = dx;
    }

    moveLeft() {
      this.position.x -= this.dx;
    }

    moveRight() {
      this.position.x += this.dx;
    }

    isCrossingLeftBorder() {
      return (this.position.x - this.dx) < 0;
    }

    isCrossingRightBorder(width) {
      return (this.position.x + this.size.width + this.dx) > width;
    }

    getInfo() {
      const { height, width } = this.size;
      const { x, y } = this.position;

      return {
        id: this.id,
        size: { height, width },
        position: { x, y },
        dx: this.dx
      };
    }
  }

  const createBalls = () => {
    const ball1 = new Ball('ball-1', { x: 30, y: 30 }, { dx: 5, dy: 2 }, 30, 'red');
    const ball2 = new Ball('ball-2', { x: 30, y: 20 }, { dx: 5, dy: 4 }, 30, 'green');
    const ball3 = new Ball('ball-3', { x: 30, y: 50 }, { dx: 5, dy: 3 }, 30, 'yellow');
    const ball4 = new Ball('ball-4', { x: 10, y: 30 }, { dx: 5, dy: 6 }, 30, 'orange');
    const ball5 = new Ball('ball-5', { x: 50, y: 40 }, { dx: 5, dy: 7 }, 30, 'pink');
    return [ball1, ball2, ball3, ball4, ball5];
  };

  const px = value => value + 'px';

  const drawBall = (viewElement, ball) => {
    const {
      id,
      size,
      color,
      position: { x, y },
    } = ball.getInfo();
    const ballElement = document.createElement('div');

    ballElement.id = id;
    ballElement.style.position = 'absolute';
    ballElement.style.top = px(y);
    ballElement.style.left = px(x);
    ballElement.style.width = px(size);
    ballElement.style.borderRadius = '50%';
    ballElement.style.aspectRatio = '1';
    ballElement.style.backgroundColor = color;

    viewElement.appendChild(ballElement);
  };

  const drawView = ({ top, left, width, height }) => {
    const view = document.createElement('div');
    view.id = 'view';
    view.style.width = px(width);
    view.style.height = px(height);
    view.style.position = 'absolute';
    view.style.top = px(top);
    view.style.left = px(left);
    view.style.border = '1px solid black';
    view.style.position = 'relative';

    document.querySelector('body').appendChild(view);
    return view;
  };

  const drawPaddle = (viewElement, paddle) => {
    const paddleElement = document.createElement('div');
    const { id, size: { height, width }, position: { x, y } } =
      paddle.getInfo();

    paddleElement.id = id;
    paddleElement.style.height = px(height);
    paddleElement.style.width = px(width);
    paddleElement.style.position = 'absolute';
    paddleElement.style.top = px(y);
    paddleElement.style.left = px(x);
    paddleElement.style.border = '1px solid black';

    viewElement.appendChild(paddleElement);
    return paddleElement;
  }

  const updateBall = (ball) => {
    const { id, position: { x, y }, } = ball.getInfo();
    const ballElement = document.getElementById(id);

    ballElement.style.top = px(x);
    ballElement.style.left = px(y);
  };

  const updatePaddle = (paddle) => {
    const { position: { x }, id } = paddle.getInfo();
    const paddleElement = document.getElementById(id);
    paddleElement.style.left = px(x);
  };

  const registerKeyDownEvent = (paddle, { width }) => {
    document.onkeydown = (event) => {
      const key = event.key;
      if (key === 'ArrowRight' && !paddle.isCrossingRightBorder(width)) {
        paddle.moveRight();
      }
      if (key === 'ArrowLeft' && !paddle.isCrossingLeftBorder(width)) {
        paddle.moveLeft();
      }
      updatePaddle(paddle);
    }
  };

  const main = () => {
    const view = { top: 200, left: 200, width: 600, height: 600 };
    const balls = createBalls();

    const paddleSize = { height: 20, width: 100 };
    const paddlePosition = { x: 0, y: view.height - paddleSize.height };
    const paddle = new Paddle('p-1', paddleSize, paddlePosition, 25);

    const viewElement = drawView(view);
    balls.forEach((ball) => drawBall(viewElement, ball));
    drawPaddle(viewElement, paddle);
    registerKeyDownEvent(paddle, view);

    setInterval(() => {
      balls.forEach((ball) => ball.move());
      balls.forEach(updateBall);
      balls.forEach((ball) => ball.hitTheBorder(view));
    }, 30);
  };

  window.onload = main;
}())