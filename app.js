document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.querySelector("#score");
    const width = 10;
    const startBtn = document.querySelector('#startTetris');
    let timerId = null;
    let score = 0;
    const colors = ['#f2a77e', '#9dc458', '#42b2b8', '#8f8bd9', '#b55ea9'];
    let endGame=false;

    const jTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2, width * 2 + 1],
        [0, width, width + 1, width + 2]
    ];
    const sTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width * 2, width * 2 + 1, width + 1, width + 2],
        [0, width, width + 1, width * 2 + 1],
        [width * 2, width * 2 + 1, width + 1, width + 2]

    ];
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const theTetriminos = [jTetromino, sTetromino, oTetromino, iTetromino, tTetromino];
    let currentPosition = 4;
    let currentRotation = 0;
    //choose random first tetrimino
    let random = Math.floor(Math.random() * theTetriminos.length);
    let nextRandom = 0;
    let current = theTetriminos[random][currentRotation];

    //draw the tetrimino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrimino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        });
    }
    //undraw the tetrimino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrimino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
    //freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetriminos.length);
            current = theTetriminos[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShapes();
            addScore();
            gameOver();
        }
    }

    //move the tetromino left, unless is at the edge or there is a tetromino already
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;

        const isTaken = current.some(index => squares[currentPosition + index].classList.contains('taken'));
        if (isTaken)
            currentPosition += 1;
        draw();

    }

    //move the tetromino right, unless is at the edge or there is a tetromino already
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width == width - 1);
        if (!isAtRightEdge)
            currentPosition += 1;
        const isTaken = current.some(index => squares[currentPosition + index].classList.contains('taken'));
        if (isTaken)
            currentPosition -= 1;
        draw();
    }

    // rotate the tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length)
            currentRotation = 0;
        current = theTetriminos[random][currentRotation];
        checkRotatedPosition();
        draw();

    }
    function control(e) {
        if (e.keyCode === 37)
            moveLeft();
        if (e.keyCode === 38) {
            rotate()
        }
        if (e.keyCode === 39) {
            moveRight();
        }
        if (e.keyCode === 40) {
            moveDown();
        }

    }

    document.addEventListener("keyup", control);

    const displayBox = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;
    const displayTetromino = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // jTetrominno
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // sTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2] // tTetromino
    ];

    // display next tetromino in the displaybox
    function displayShapes() {
        displayBox.forEach(box => {
            box.classList.remove('tetrimino');
            box.style.backgroundColor = '';
        })
        displayTetromino[nextRandom].forEach(index => {
            displayBox[displayIndex + index].classList.add('tetrimino');
            displayBox[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    startBtn.addEventListener("click", () => {
        if(endGame){
            //restart new game
            for(let i=0;i<=199;i++){
                score=0;
                scoreDisplay.innerHTML='0';
                squares[i].classList.remove('tetrimino');
                squares[i].classList.remove('taken');
                squares[i].style.backgroundColor='';
            }
            endGame=false;
            startBtn.innerHTML="Start/Pause";
        }
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else{
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetriminos.length);
            displayShapes();
        }

    })


    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('tetrimino');
                    squares[index].classList.remove('taken');
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    //gameover 
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = "end";
            clearInterval(timerId);
            timerId = null;
            endGame=true;
            startBtn.innerHTML="New Game";
        }
    }

    ///FIX ROTATION OF TETROMINOS A THE EDGE 
    function isAtRight() {
        return current.some(index => (currentPosition + index) % width === width - 1)
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    //rotation at edge bug fix
    function checkRotatedPosition(P) {
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P + 1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
            if (isAtRight()) {            //use actual position to check if it's flipped over to right side
                currentPosition += 1    //if so, add one to wrap it back around
                checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }
})