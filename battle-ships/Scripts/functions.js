export function createEmptyBoard(size) {
  return new Array(size * size).fill(0);
}

function isAreaClear(board, gridSize, index, size, isHorizontal) {
  for (let i = 0; i < size; i++) {
    const row = Math.floor(
      (isHorizontal ? index + i : index + i * gridSize) / gridSize
    );
    const col = isHorizontal ? (index + i) % gridSize : index % gridSize;

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
          const checkIndex = r * gridSize + c;
          if (board[checkIndex] !== 0) return false;
        }
      }
    }
  }
  return true;
}

export function placeShip(board, size, gridSize, shipId) {
  let placed = false;
  while (!placed) {
    const horizontal = Math.random() < 0.5;
    const row = horizontal
      ? Math.floor(Math.random() * gridSize)
      : Math.floor(Math.random() * (gridSize - size + 1));
    const col = horizontal
      ? Math.floor(Math.random() * (gridSize - size + 1))
      : Math.floor(Math.random() * gridSize);
    const start = row * gridSize + col;

    if (isAreaClear(board, gridSize, start, size, horizontal)) {
      for (let i = 0; i < size; i++) {
        const offset = horizontal ? i : i * gridSize;
        board[start + offset] = shipId;
      }
      placed = true;
    }
  }
}

export function placeAllShips(board, gridSize, ship2, ship3, ship4, ship5) {
  const ships = [];
  let shipId = 2;

  const place = (count, size) => {
    for (let i = 0; i < count; i++) {
      placeShip(board, size, gridSize, shipId++);
      ships.push(size);
    }
  };

  place(ship2, 2);
  place(ship3, 3);
  place(ship4, 4);
  place(ship5, 5);

  return ships;
}

export function renderBoard(
  board,
  size,
  ship2,
  ship3,
  ship4,
  ship5,
  shipSizes
) {
  const totalParts = shipSizes.reduce((sum, val) => sum + val, 0);
  const hitCount = Array(shipSizes.length).fill(0);
  const shipsRemaining = [ship2, ship3, ship4, ship5];
  let hits = 0;
  let sunken = 0;
  const explosionSound = new Audio("./assets/audio/explosion.mp3");

  const container = document.getElementById("game-container");
  container.innerHTML = `<div id="game-messages"></div>`;

  const wrapper = document.createElement("div");
  wrapper.id = "game-wrapper";

  const table = document.createElement("table");
  table.id = "game-board";

  for (let row = 0; row < size; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      const td = document.createElement("td");
      td.dataset.index = index;

      td.addEventListener("click", () => handleClick(td, index));
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  const sidebar = createSidebar(ship2, ship3, ship4, ship5);
  wrapper.appendChild(table);
  wrapper.appendChild(sidebar);
  container.appendChild(wrapper);

  updateShipStatusDisplay();

  // ========== פונקציות פנימיות ==========

  function handleClick(td, index) {
    if (td.textContent !== "") return;

    const value = board[index];
    td.style.pointerEvents = "none";

    if (value >= 2) {
      td.textContent = "💥";
      hits++;
      document.getElementById("game-messages").textContent = "Hit!!!";
      document.getElementById("game-messages").className = "hit";

      const shipIndex = value - 2;
      hitCount[shipIndex]++;

      if (hitCount[shipIndex] === shipSizes[shipIndex]) {
        sunken++;
        explosionSound.play();
        markSunkShip(value);
        updateShipStatus(shipSizes[shipIndex]);
        updateShipStatusDisplay();
        console.log(`🚢 ספינה בגודל ${shipSizes[shipIndex]} הושמדה!`);
      }
    } else {
      td.textContent = "❌";
      document.getElementById("game-messages").textContent = "Miss :(";
      document.getElementById("game-messages").className = "miss";
    }

    if (hits === totalParts) {
      document.getElementById("game-messages").textContent =
        "Boom! Every ship is fish food now!";
      document.getElementById("game-messages").className = "win";

      disableBoard();
    }
  }

  function markSunkShip(shipId) {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === shipId) {
        const cell = document.querySelector(`td[data-index="${i}"]`);
        if (cell) cell.classList.add("sunken");
      }
    }
  }

  function updateShipStatus(size) {
    if (size === 2) shipsRemaining[0]--;
    if (size === 3) shipsRemaining[1]--;
    if (size === 4) shipsRemaining[2]--;
    if (size === 5) shipsRemaining[3]--;
  }

  function updateShipStatusDisplay() {
    document.getElementById("s2").textContent = shipsRemaining[0];
    document.getElementById("s3").textContent = shipsRemaining[1];
    document.getElementById("s4").textContent = shipsRemaining[2];
    document.getElementById("s5").textContent = shipsRemaining[3];
  }

  function disableBoard() {
    const allCells = document.querySelectorAll("#game-board td");
    allCells.forEach((cell) => (cell.style.pointerEvents = "none"));
  }

  function createSidebar(s2, s3, s4, s5) {
    const sidebar = document.createElement("div");
    sidebar.id = "ship-status";
    sidebar.innerHTML = `
      <h3>Remaining Ships</h3>
      <table id="ships-table">
        <tr><td>Size 2</td><td id="s2">${s2}</td></tr>
        <tr><td>Size 3</td><td id="s3">${s3}</td></tr>
        <tr><td>Size 4</td><td id="s4">${s4}</td></tr>
        <tr><td>Size 5</td><td id="s5">${s5}</td></tr>
      </table>
    `;
    return sidebar;
  }
}
