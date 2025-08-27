import { createEmptyBoard, placeAllShips, renderBoard } from "./functions.js";

document.getElementById("Start_game").addEventListener("click", () => {
  const sizeInput = document.querySelector('input[name="grid_size"]:checked');
  if (!sizeInput) {
    alert("Select a board size");
    return;
  }

  const gridSize = parseInt(sizeInput.value);
  const ship2 = parseInt(document.getElementById("ship2").value);
  const ship3 = parseInt(document.getElementById("ship3").value);
  const ship4 = parseInt(document.getElementById("ship4").value);
  const ship5 = parseInt(document.getElementById("ship5").value);

  const totalShips = ship2 + ship3 + ship4 + ship5;
  if (totalShips !== 5) {
    alert("You must place exactly 5 ships in total");
    return;
  }

  const board = createEmptyBoard(gridSize);
  const shipSizes = placeAllShips(board, gridSize, ship2, ship3, ship4, ship5);

  // הסתרת הטופס והצגת הלוח
  document.getElementById("game-form").style.display = "none";
  renderBoard(board, gridSize, ship2, ship3, ship4, ship5, shipSizes);
});
