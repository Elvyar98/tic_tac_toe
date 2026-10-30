function createPlayer(name, marker) {
  let score = 0;

  const getName = () => name;
  const getMarker = () => marker;
  const getScore = () => score;
  const increaseScore = () => score++;
  const resetScore = () => {
    score = 0;
  };

  return { getName, getMarker, getScore, increaseScore, resetScore };
}

function createBoard() {
  let grid = new Array(9).fill(0);
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getGrid = () => [...grid];
  const placeMarker = (marker, position) => {
    if (grid[position] === 0) {
      grid[position] = marker;
      return 1;
    } else {
      return 0;
    }
  };

  const getResults = () => {
    for (const line of winningLines) {
      const [a, b, c] = line;

      if ((grid[a] || grid[b] || grid[c]) != 0) {
        if (grid[a] === grid[b] && grid[b] === grid[c]) {
          return { status: "win", winner: grid[a] };
        }
      }
    }

    if (grid.includes(0)) {
      return { status: "continue" };
    } else {
      return { status: "draw" };
    }
  };

  return { getGrid, placeMarker, getResults };
}

const game = (() => {
  let round = 0;
  let activeRound = false;
  let players = [];
  let activeMarker = 0;
  let currentBoard = null;

  function changeMarker() {
    if (round % 2 == 1) {
      activeMarker = players[0].getMarker();
      return `${players[0].getName()} starts`;
    } else {
      activeMarker = players[1].getMarker();
      return `${players[1].getName()} starts`;
    }
  }

  const startGame = (name1, marker1, name2, marker2) => {
    players = [];
    round = 1;
    activeRound = true;
    const player1 = createPlayer(name1, marker1);
    const player2 = createPlayer(name2, marker2);

    currentBoard = createBoard();
    players.push(player1);
    players.push(player2);
    activeMarker = player1.getMarker();
    return `${player1.getName()} starts`;
  };

  const playTurn = (position) => {
    if (!activeRound) return { status: "inactive" };

    if (!currentBoard.placeMarker(activeMarker, position)) {
      return { status: "refused" };
    }

    const result = currentBoard.getResults();
    const current = players.find((p) => p.getMarker() === activeMarker);

    if (result.status === "win") {
      current.increaseScore();
      activeRound = false;
      return { status: "win", winner: current.getName() };
    }

    if (result.status === "draw") {
      activeRound = false;
      return { status: "draw" };
    }

    const next = players.find((p) => p.getMarker() !== activeMarker);
    activeMarker = next.getMarker();
    return { status: "continue", next: next.getName() };
  };

  const newRound = () => {
    round++;
    currentBoard = createBoard();
    changeMarker();
    activeRound = true;
  };

  const restart = () => {
    for (const player of players) player.resetScore();
    round = 0;
    currentBoard = createBoard();
    changeMarker();
    activeRound = true;
  };

  const getRound = () => round;
  const getScores = () => {
    let scores = [];
    for (const player of players) {
      scores.push({
        name: `${player.getName()}`,
        score: `${player.getScore()}`,
      });
    }

    return scores;
  };

  const getActivePlayer = () => {
    for (const player of players) {
      if (player.getMarker() == activeMarker) return player.getName();
    }
  };

  const getGrid = () => currentBoard.getGrid();

  return {
    startGame,
    playTurn,
    newRound,
    restart,
    getRound,
    getScores,
    getActivePlayer,
    getGrid,
  };
})();

const display = (() => {
  const cells = document.querySelectorAll(".grid-cell");
  const statusBox = document.querySelector("#status-box");
  const playerOneName = document.querySelector(".player-one-name");
  const playerOneScore = document.querySelector(".player-one-score");
  const playerTwoName = document.querySelector(".player-two-name");
  const playerTwoScore = document.querySelector(".player-two-score");
  const roundNumber = document.querySelector(".round-number");
  const resultText = document.querySelector(".result-text");

  const renderGrid = (grid) => {
    cells.forEach((cell) => {
      const value = grid[cell.dataset.position];
      cell.textContent = value === 0 ? "" : value;
    });
  };

  const showResults = (result, scores, round) => {
    if (result.status == "win") {
      resultText.textContent = `Winner is ${result.winner}`;
    } else {
      resultText.textContent = result.status;
    }

    statusBox.addEventListener("cancel", (e) => {
      (e, preventDefault());
    });

    statusBox.addEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        e.preventDefault();
      }
    });

    playerOneName.textContent = scores[0].name;
    playerOneScore.textContent = scores[0].score;
    playerTwoName.textContent = scores[1].name;
    playerTwoScore.textContent = scores[1].score;

    roundNumber.textContent = round;
    statusBox.showModal();
  };
  return { renderGrid, showResults };
})();

const cells = document.querySelectorAll(".grid-cell");

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const result = game.playTurn(Number(cell.dataset.position));

    if (result.status === "refused" || result.status === "inactive") {
      cell.classList.add("flash");
      setTimeout(() => cell.classList.remove("flash"), 300);
    }

    if (result.status === "win" || result.status === "draw") {
      display.showResults(result, game.getScores(), game.getRound());
    }
    display.renderGrid(game.getGrid());
  });
});

const restarbtn = document.querySelector(".restart-button");
const newRoundbtn = document.querySelector(".new-round-button");

newRoundbtn.addEventListener("click", () => {
  game.newRound();
  display.renderGrid(game.getGrid());
});

restarbtn.addEventListener("click", () => {
  game.restart();
  display.renderGrid(game.getGrid());
});

game.startGame("A", "X", "B", "O");
display.renderGrid(game.getGrid());
