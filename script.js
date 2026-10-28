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
  let players = [];
  let activeIndex = 0;
  let currentBoard = null;

  function changeActivePlayer() {
    if (round % 2 == 0) {
      activeIndex = players[0].getMarker();
      return `${players[0].getName()} starts`;
    } else {
      activeIndex = players[1].getMarker();
      return `${players[1].getName()} starts`;
    }
  }

  const startGame = (name1, marker1, name2, marker2) => {
    const player1 = createPlayer(name1, marker1);
    const player2 = createPlayer(name2, marker2);

    currentBoard = createBoard();
    players.push(player1);
    players.push(player2);
    activeIndex = player1.getMarker();
    return `${player1.getName()} starts`;
  };

  const playTurn = () => {
    if (currentBoard.placeMarker(activeIndex)) {
      if (currentBoard.getResults().some((e) => e.status == "win")) {
        for (const player of players) {
          if (player.getMarker() == activeIndex) {
            player.increaseScore();
            return { status: "winner", winner: player.getName() };
          }
        }
      } else if (currentBoard.getResults().some((e) => e.status == "draw")) {
        return currentBoard.getResults();
      } else {
        for (const player of players) {
          if (player.getMarker() != activeIndex)
            activeIndex = player.getMarker();
          return { status: "continue", next: player.getName() };
        }
      }
    } else {
      return { status: "refused" };
    }
  };

  const newRound = () => {
    round++;
    currentBoard = createBoard();
    changeActivePlayer();
  };

  const restart = () => {
    for (const player of players) player.resetScore();
    round = 0;
    currentBoard = createBoard();
    changeActivePlayer();
  };

  const getRound = () => round;
  const getScores = () => {
    let scores = [];
    for (const player of players) {
      scores.push({ name: player.getName(), score: player.getScore() });
    }
  };

  const getActivePlayer = () => {
    for (const player of players) {
      if (player.getMarker() == activeIndex) player.getName();
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
