const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score-value');
const customImageInput = document.getElementById('custom-image');
const resetImageBtn = document.getElementById('reset-image');
const speedSelect = document.getElementById('speed-select');

const TILE_SIZE = 20;
const ROWS = 21;
const COLS = 21;

// 1: wall, 0: dot, 2: empty
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,2,1,1,2,1,0,1,1,1,1,1],
    [2,2,2,2,2,0,2,2,1,2,2,2,1,2,2,0,2,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let gameMap = JSON.parse(JSON.stringify(map));
let score = 0;

let customImage = null;

// Handle custom image upload
customImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                customImage = img;
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
});

resetImageBtn.addEventListener('click', () => {
    customImage = null;
    customImageInput.value = '';
});

// Handle speed change dynamically
speedSelect.addEventListener('change', (e) => {
    pacman.speed = parseFloat(e.target.value);
    
    // Adjust current and intended velocities to match new speed
    if (pacman.vx !== 0) pacman.vx = Math.sign(pacman.vx) * pacman.speed;
    if (pacman.vy !== 0) pacman.vy = Math.sign(pacman.vy) * pacman.speed;
    if (pacman.nextVx !== 0) pacman.nextVx = Math.sign(pacman.nextVx) * pacman.speed;
    if (pacman.nextVy !== 0) pacman.nextVy = Math.sign(pacman.nextVy) * pacman.speed;
});

// Pac-Man definition
const pacman = {
    x: 10 * TILE_SIZE + TILE_SIZE / 2,
    y: 15 * TILE_SIZE + TILE_SIZE / 2,
    vx: 0,
    vy: 0,
    speed: 2,
    radius: 8,
    angle: 0,
    mouthOpen: 0,
    mouthDir: 1,
    nextVx: 0,
    nextVy: 0
};

const keys = {};
window.addEventListener('keydown', e => {
    // Prevent default scrolling behavior for arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
    }
    keys[e.code] = true;
});
window.addEventListener('keyup', e => keys[e.code] = false);

function checkCollision(x, y, vx, vy) {
    const margin = 2; // Small margin to easily move through corridors
    const left = x - pacman.radius + margin + vx;
    const right = x + pacman.radius - margin + vx;
    const top = y - pacman.radius + margin + vy;
    const bottom = y + pacman.radius - margin + vy;

    const tl = getTile(left, top);
    const tr = getTile(right, top);
    const bl = getTile(left, bottom);
    const br = getTile(right, bottom);

    if (tl === 1 || tr === 1 || bl === 1 || br === 1) {
        return true;
    }
    return false;
}

function getTile(x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return 1;
    return gameMap[row][col];
}

function update() {
    // Read input to determine next intended direction
    if (keys['ArrowLeft']) { pacman.nextVx = -pacman.speed; pacman.nextVy = 0; }
    if (keys['ArrowRight']) { pacman.nextVx = pacman.speed; pacman.nextVy = 0; }
    if (keys['ArrowUp']) { pacman.nextVx = 0; pacman.nextVy = -pacman.speed; }
    if (keys['ArrowDown']) { pacman.nextVx = 0; pacman.nextVy = pacman.speed; }

    // Check if we can move in the next intended direction
    if (!checkCollision(pacman.x, pacman.y, pacman.nextVx, pacman.nextVy)) {
        // Snap to grid axis loosely to make turning smoother
        if (pacman.nextVx !== 0) {
            pacman.y = Math.floor(pacman.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        } else if (pacman.nextVy !== 0) {
            pacman.x = Math.floor(pacman.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        }
        
        pacman.vx = pacman.nextVx;
        pacman.vy = pacman.nextVy;
    }

    // Check if we can move in current direction
    if (!checkCollision(pacman.x, pacman.y, pacman.vx, pacman.vy)) {
        pacman.x += pacman.vx;
        pacman.y += pacman.vy;
    } else {
        pacman.vx = 0;
        pacman.vy = 0;
    }

    // Tunnel wrapping
    if (pacman.x < 0) pacman.x = canvas.width;
    if (pacman.x > canvas.width) pacman.x = 0;

    // Dot eating
    const col = Math.floor(pacman.x / TILE_SIZE);
    const row = Math.floor(pacman.y / TILE_SIZE);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        if (gameMap[row][col] === 0) {
            gameMap[row][col] = 2; // Mark as empty
            score += 10;
            scoreElement.innerText = score;
        }
    }

    // Mouth animation and rotation
    if (pacman.vx !== 0 || pacman.vy !== 0) {
        pacman.mouthOpen += 0.08 * pacman.mouthDir;
        if (pacman.mouthOpen >= 0.3 || pacman.mouthOpen <= 0) {
            pacman.mouthDir *= -1;
        }
    }

    if (pacman.vx > 0) pacman.angle = 0;
    else if (pacman.vx < 0) pacman.angle = Math.PI;
    else if (pacman.vy > 0) pacman.angle = Math.PI / 2;
    else if (pacman.vy < 0) pacman.angle = -Math.PI / 2;
}

function drawMap() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (gameMap[r][c] === 1) {
                ctx.fillStyle = '#1919A6'; // Classic blue walls
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (gameMap[r][c] === 0) {
                ctx.fillStyle = '#FFB8AE'; // Pinkish dots
                ctx.beginPath();
                ctx.arc(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPacman() {
    ctx.save();
    ctx.translate(pacman.x, pacman.y);
    ctx.rotate(pacman.angle);

    if (customImage) {
        // Draw custom user image
        const size = pacman.radius * 3.5; // Slightly larger visually
        ctx.drawImage(customImage, -size/2, -size/2, size, size);
    } else {
        // Draw classic canvas arc pacman
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(0, 0, pacman.radius + 1, pacman.mouthOpen * Math.PI, (2 - pacman.mouthOpen) * Math.PI);
        ctx.lineTo(0, 0);
        ctx.fill();
    }

    ctx.restore();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawMap();
    drawPacman();
    requestAnimationFrame(loop);
}

// Start game loop
loop();
