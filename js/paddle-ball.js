(function () {
  const createBall = () => {
    const position = new Position(210, 210);
    const vector = new Vector(-3, 5);
    const size = { height: 30, width: 30 };
    const ball1 = new Ball('ball-1', position, vector, size, 'red');

    return ball1;
  };

  const createView = () => {
    const viewPosition = new Position(200, 200);
    const viewSize = { width: 600, height: 600 };

    return new View('view', viewPosition, viewSize);
  };

  const createPaddle = () => {
    const paddlePosition = new Position(200, 790);
    const paddleSize = { width: 100, height: 5 };
    const paddleSpeed = new Vector(20, 0);
    return new Paddle('p-1', paddlePosition, paddleSize, paddleSpeed);
  };

  const createScoreboard = scoreboard => {
    const scoreboardElement = document.createElement('div');

    scoreboardElement.id = scoreboard.id;
    scoreboardElement.style.fontSize = px(26);
    scoreboardElement.style.display = 'block';
    scoreboardElement.style.position = 'absolute';
    scoreboardElement.style.left = px(1000);
    scoreboardElement.style.top = px(500);

    scoreboardElement.innerText = `Points: ${scoreboard.points}`;

    document.querySelector('body').appendChild(scoreboardElement);
    return scoreboardElement;
  }

  const gameOverMessage = () => {
    const message = document.createElement('div');

    message.style.fontSize = px(40);
    message.style.display = 'block';
    message.style.position = 'absolute';
    message.style.left = px(700);
    message.style.top = px(100);

    message.innerText = 'Game Over.';

    document.querySelector('body').appendChild(message);
  }

  const drawBall = ballInfo => {
    const { id, size: { height }, color, position: { x, y }, } = ballInfo;
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

  const drawView = viewInfo => {
    const viewElement = document.createElement('div');

    const { position: { x, y }, size: { width, height } } = viewInfo;
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

  const drawPaddle = paddleInfo => {
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

  const px = value => value + 'px';

  const updateBall = ({ id, position: { x, y } }) => {
    const ballElement = document.getElementById(id);

    ballElement.style.top = px(y);
    ballElement.style.left = px(x);
  };

  const updatePaddle = paddleInfo => {
    const paddleElement = document.getElementById(paddleInfo.id);
    paddleElement.style.left = px(paddleInfo.position.x);
  }

  const updateScoreBoard = scoreboardInfo => {
    const scoreboardElement = document.getElementById(scoreboardInfo.id);
    scoreboardElement.innerText = `Points: ${scoreboardInfo.points}`;
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

  const playGame = (game) => {
    const intervalId = setInterval(() => {
      game.start();
      game.updateScore();

      const { ball, scoreboard } = game.getInfo();
      updateBall(ball);
      updateScoreBoard(scoreboard);

      if (game.isGameOver()) {
        clearInterval(intervalId);
        gameOverMessage();
      };
    }, 30)
  }

  const main = () => {
    const view = createView();
    drawView(view.getInfo());

    const paddle = createPaddle();
    drawPaddle(paddle.getInfo());
    registerPaddleEvent(paddle, view);

    const ball = createBall();
    drawBall(ball.getInfo());

    const scoreboard = new Scoreboard('scoreboard', 0);
    createScoreboard(scoreboard.getInfo());

    const game = new Game(view, paddle, ball, scoreboard);
    playGame(game);
  };

  window.onload = main;
}())