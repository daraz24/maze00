class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
  }
}

function generateMaze() {
  maze = [];
  for (let y = 0; y < mazeHeight; y++) {
    const row = [];
    for (let x = 0; x < mazeWidth; x++) {
      row.push(new Cell(x, y));
    }
    maze.push(row);
  }

  const stack = [];
  const startCell = maze[mazeHeight - 1][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack.pop();
    const neighbors = getUnvisitedNeighbors(current);

    if (neighbors.length > 0) {
      stack.push(current);

      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWallBetween(current, neighbor);

      neighbor.visited = true;
      stack.push(neighbor);
    }
  }

  drawMaze();
}

function getUnvisitedNeighbors(cell) {
  const neighbors = [];

  if (cell.y > 0 && !maze[cell.y - 1][cell.x].visited) {
    neighbors.push(maze[cell.y - 1][cell.x]);
  }
  if (cell.x < mazeWidth - 1 && !maze[cell.y][cell.x + 1].visited) {
    neighbors.push(maze[cell.y][cell.x + 1]);
  }
  if (cell.y < mazeHeight - 1 && !maze[cell.y + 1][cell.x].visited) {
    neighbors.push(maze[cell.y + 1][cell.x]);
  }
  if (cell.x > 0 && !maze[cell.y][cell.x - 1].visited) {
    neighbors.push(maze[cell.y][cell.x - 1]);
  }

  return neighbors;
}

function removeWallBetween(a, b) {
  if (a.x === b.x) {
    if (a.y < b.y) {
      a.walls.bottom = false;
      b.walls.top = false;
    } else {
      a.walls.top = false;
      b.walls.bottom = false;
    }
  } else {
    if (a.x < b.x) {
      a.walls.right = false;
      b.walls.left = false;
    } else {
      a.walls.left = false;
      b.walls.right = false;
    }
  }
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const row of maze) {
    for (const cell of row) {
      const x = cell.x;
      const y = cell.y;

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;

      if (cell.walls.top) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, y * cellSize);
        ctx.lineTo((x + 1) * cellSize, y * cellSize);
        ctx.stroke();
      }
      if (cell.walls.right) {
        ctx.beginPath();
        ctx.moveTo((x + 1) * cellSize, y * cellSize);
        ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
        ctx.stroke();
      }
      if (cell.walls.bottom) {
        ctx.beginPath();
        ctx.moveTo((x + 1) * cellSize, (y + 1) * cellSize);
        ctx.lineTo(x * cellSize, (y + 1) * cellSize);
        ctx.stroke();
      }
      if (cell.walls.left) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, y * cellSize);
        ctx.lineTo(x * cellSize, (y + 1) * cellSize);
        ctx.stroke();
      }
    }
  }

  // Start and goal symbols
  ctx.font = `${cellSize * 0.8}px Arial`;
  ctx.fillStyle = 'blue';
  ctx.fillText('◆', cellSize * 0.1, (mazeHeight - 1) * cellSize + cellSize * 0.8);
  ctx.fillStyle = 'green';
  ctx.fillText('★', (mazeWidth - 1) * cellSize + cellSize * 0.1, cellSize * 0.8);
}

function drawPath() {
  ctx.beginPath();
  ctx.strokeStyle = 'red';
  ctx.lineWidth = cellSize / 4;
  ctx.lineCap = 'round';
  ctx.moveTo(path[0].x * cellSize + cellSize / 2, path[0].y * cellSize + cellSize / 2);

  for (const point of path.slice(1)) {
    ctx.lineTo(point.x * cellSize + cellSize / 2, point.y * cellSize + cellSize / 2);
  }

  ctx.stroke();
}

function solveMaze() {
  // Reset the visited property of all cells
  for (const row of maze) {
    for (const cell of row) {
      cell.visited = false;
    }
  }

  path = [];
  const stack = [];
  const startCell = maze[mazeHeight - 1][0];
  const endCell = maze[0][mazeWidth - 1];

  stack.push({
    cell: startCell,
    previous: null
  });

  while (stack.length > 0) {
    const current = stack.pop();
    const cell = current.cell;

    if (cell === endCell) {
      let temp = current;
      while (temp !== null) {
        path.unshift(temp.cell);
        temp = temp.previous;
      }
      break;
    }

    if (!cell.visited) {
      cell.visited = true;
      const neighbors = getVisitedNeighbors(cell);
      for (const neighbor of neighbors) {
        stack.push({
          cell: neighbor,
          previous: current
        });
      }
    }
  }

  drawMaze();
  animatePath(0);
}


function animatePath(index) {
  if (index < path.length) {
    drawPathStep(path[index]);
    setTimeout(() => animatePath(index + 1), 200); // window.requestAnimationFrame を setTimeout に変更し、200 ミリ秒に設定
  }
}

function drawPathStep(point) {
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.arc(point.x * cellSize + cellSize / 2, point.y * cellSize + cellSize / 2, cellSize / 8, 0, Math.PI * 2); // cellSize / 8 に変更
  ctx.fill();
}

function getVisitedNeighbors(cell) {
  const neighbors = [];

  if (cell.y > 0 && !cell.walls.top) {
    neighbors.push(maze[cell.y - 1][cell.x]);
  }
  if (cell.x < mazeWidth - 1 && !cell.walls.right) {
    neighbors.push(maze[cell.y][cell.x + 1]);
  }
  if (cell.y < mazeHeight - 1 && !cell.walls.bottom) {
    neighbors.push(maze[cell.y + 1][cell.x]);
  }
  if (cell.x > 0 && !cell.walls.left) {
    neighbors.push(maze[cell.y][cell.x - 1]);
  }

  return neighbors;
}


document.getElementById('generate-btn').addEventListener('click', generateMaze);
document.getElementById('solve-btn').addEventListener('click', solveMaze);

const canvas = document.getElementById('maze-canvas');
const ctx = canvas.getContext('2d');
const mazeWidth = 30;
const mazeHeight = 30;
const cellSize = 20;
canvas.width = mazeWidth * cellSize;
canvas.height = mazeHeight * cellSize;

let maze = [];
let path = [];

generateMaze();
