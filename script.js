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
    if (grid[position] === 0) return 0;
    else {
      grid[position] = marker;
      return 1;
    }
  };

  const getResults = () => {
    winningLines.forEach((line) => {
      if (grid[line[0]] == grid[line[1]] && grid[line[1]] == grid[line[2]]) {
        return { status: "win", marker: line[1] };
      }
    });

    grid.forEach((pos) => {
      if (pos == 0) {
        return { status: "continue" };
      } else {
        return { status: "draw" };
      }
    });
  };
}

const game = () => {
  let rounds = 0;

  const startGame = (name1, marker1, name2, marker2) => {
    const player1 = createPlayer(name1, marker1);
    const player2 = createPlayer(name2, marker2);
    const gameBoard = createBoard();
  };

  const playTurn = () => {};
};
