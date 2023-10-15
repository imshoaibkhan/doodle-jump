// board 
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler 
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerHeight/2
let doodlerY = boardHeight*7/8 - doodlerHeight
let doodlerRightImg;
let doodlerLeftImg;

// score
let score = 0
let maxScore = 0
let gameOver = false

// physics
let velocityX = 0
let velocityY = 0 // jump speed
let initVelocityY = -8 // starting push
let gravity = 0.4

// platform
let platformArray = []
let platformWidth = 60
let platformHeight = 18
let platformImg

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
}

window.onload = function() {
    board = document.getElementById('board')
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext('2d')

    // draw doodler
    // context.fillStyle = "green"
    // context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height)

    // load images
    doodlerRightImg = new Image()
    doodlerRightImg.src = './doodler-right.png'
    doodler.img = doodlerRightImg
    doodlerRightImg.onload = () => {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height)
    }

    doodlerLeftImg = new Image()
    doodlerLeftImg.src = './doodler-left.png'

    platformImg = new Image()
    platformImg.src = './platform.png'


    velocityY = initVelocityY;
    placePlatform()
    requestAnimationFrame(update)
    document.addEventListener('keydown', movedoodler)
}

const update = () => {
    requestAnimationFrame(update)
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height)

    // doodler again and again
    doodler.x += velocityX
    if (doodler.x > boardWidth) {
        doodler.x = 0
    }else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth
    }

    velocityY += gravity
    doodler.y += velocityY
    if (doodler.y > board.height) {
        gameOver = true
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height)

    // platforms

    for ( i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i]
        if (velocityY < 0 && doodler.y < boardHeight*3/4){
            platform.y -= initVelocityY
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initVelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platformWidth, platform.height)
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift()
        newPlatform();
    }

    //score
    updateScore()
        context.fillStyle="black";
        context.font="16px sans-serif"
        context.fillText(score, 5, 20)
        if (gameOver) {
            context.fillText("Game Over!, Press 'Space' to Restart", boardWidth/7, boardHeight*7/8 )
        }
}

const movedoodler = (e) => {
    if (e.code == "ArrowRight" || e.code == 'KeyD') {
        // move right
        velocityX = 4;
        doodler.img = doodlerRightImg
    } else if (e.code == "ArrowLeft" || e.code == 'KeyA') {
        // move left
        velocityX = -4;
        doodler.img = doodlerLeftImg
    }else if (e.code == "Space" && gameOver) {
        //reset 
        // location.reload()
        doodler = {
            img: doodlerRightImg,
            x: doodlerX,
            y: doodlerY,
            width: doodlerWidth,
            height: doodlerHeight
        }

        velocityX = 0
        velocityY = initVelocityY
        score = 0
        maxScore = 0
        gameOver = false
        placePlatform()
    }
}

const placePlatform = () => {
    platformArray = []

    // starting platforms
    let platform = {
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform)

    // platform = {
    //     img: platformImg,
    //     x: boardWidth / 2.2,
    //     y: boardHeight - 150,
    //     width: platformWidth,
    //     height: platformHeight
    // }

    // platformArray.push(platform)

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4)
        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 75*i - 150,
            width: platformWidth,
            height: platformHeight
        }
    
        platformArray.push(platform)
    }
}

const newPlatform = () => {
    let randomX = Math.floor(Math.random() * boardWidth*3/4)
        let platform = {
            img: platformImg,
            x: randomX,
            y: -platformHeight,
            width: platformWidth,
            height: platformHeight
        }
    
        platformArray.push(platform)
    }


const detectCollision = (a, b) => {
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y +b.height &&
    a.y + a.height > b.y;

}

const updateScore = () => {
    let points = Math.floor(50*Math.random())
    if (velocityY < 0) {
        maxScore += points
            if (score < maxScore) {
                score = maxScore
            }
    }else if (velocityY > 0) {
        maxScore -= points
    }
}
