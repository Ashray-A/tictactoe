// Gameboard Module (IIFE)
const Gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""]; // 9 empty spots
  
    const getBoard = () => board;
    const setCell = (index, marker) => {
      if (board[index] === "") board[index] = marker;
    };
    const resetBoard = () => {
      board = ["", "", "", "", "", "", "", "", ""];
    };
  
    return { getBoard, setCell, resetBoard };
  })();
  
  // Player Factory
  const Player = (marker) => {
    const getMarker = () => marker;
    return { getMarker };
  };
  
  // Game Controller Module
  const GameController = (function() {
    let playerX = Player("X");
    let playerO = Player("O");
    let currentPlayer = playerX;
    let gameOver = false;
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === playerX ? playerO : playerX;
    };
  
    const getCurrentPlayer = () => currentPlayer;
  
    const checkWinner = () => {
      const board = Gameboard.getBoard();
      const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]  // diagonals
      ];
  
      for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a]; // Return the winner marker
        }
      }
  
      if (board.every(cell => cell !== "")) {
        return "Tie";
      }
  
      return null;
    };
  
    const isGameOver = () => gameOver;
  
    const resetGame = () => {
      Gameboard.resetBoard();
      gameOver = false;
      currentPlayer = playerX;
    };
  
    const playRound = (index) => {
      if (Gameboard.getBoard()[index] === "" && !gameOver) {
        Gameboard.setCell(index, getCurrentPlayer().getMarker());
        const winner = checkWinner();
        if (winner) {
          gameOver = true;
          return winner;
        } else {
          switchPlayer();
        }
      }
      return null;
    };
  
    return { playRound, resetGame, isGameOver, getCurrentPlayer };
  })();
  
  // Display Controller Module
  const DisplayController = (function() {
    const gameBoardElement = document.getElementById("game-board");
    const playerInfoElement = document.getElementById("player-info");
    const restartBtn = document.getElementById("restart-btn");
  
    const renderBoard = () => {
      const board = Gameboard.getBoard();
      gameBoardElement.innerHTML = ""; // Clear previous render
      board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.textContent = cell;
        if (cell !== "") cellElement.classList.add("taken");
        cellElement.addEventListener("click", () => handleCellClick(index));
        gameBoardElement.appendChild(cellElement);
      });
    };
  
    const handleCellClick = (index) => {
      const result = GameController.playRound(index);
      if (result) {
        playerInfoElement.textContent = result === "Tie" ? "It's a Tie!" : `${result} Wins!`;
      } else {
        playerInfoElement.textContent = `Current Player: ${GameController.getCurrentPlayer().getMarker()}`;
      }
      renderBoard();
    };
  
    const resetGame = () => {
      GameController.resetGame();
      playerInfoElement.textContent = `Current Player: ${GameController.getCurrentPlayer().getMarker()}`;
      renderBoard();
    };
  
    restartBtn.addEventListener("click", resetGame);
  
    return { renderBoard, resetGame };
  })();
  
  // Initialize Game
  DisplayController.resetGame();
  