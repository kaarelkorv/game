let prevFrameTimeStamp = 0
let gameOn
const gameWidth = 1200
const gameHight = 600
const step = 5
let alienCount = 18
const alienRows = 3
let scoreCount = 0
let playTime
let startTime
let pauseDuration = 0
let pauseStart //marks the time when "p" was last hit
let aliensDirection = true // aliens moving left or right
let canChangeDirection = false //time of aliens movement from one side to other
let alienSwing //aliengroup moving back and forth
let alienShoot // bottom row of aliens shooting
let gameTime = 60 // time in seconds
let alienBulletSpeed = 8
let level = 0
let lives = 2


//Set frame independent intervals:
function setIntervals() {
    //Aliengroup direction change
    alienSwing = setInterval(() => {
        canChangeDirection = true
    }, 4000)

    //Aliengroup shooting interval
    alienShoot = setInterval(() => {
        createAlienBullet()
    }, 1000)
}

//Clear frame independent intervals
function clearIntervals() {
    clearInterval(alienSwing)
    clearInterval(alienShoot)
}
    

//Aliens direction changer
function alienDirectionChanger() {
    if (canChangeDirection && aliensDirection) {
        aliensDirection = false
        canChangeDirection = false
    } else if (canChangeDirection && !aliensDirection) {
        aliensDirection = true
        canChangeDirection = false
    }
}

const score = document.querySelector('.score')
const timeCounter = document.querySelector('.timeCounter')
let gameWindow = document.querySelector('.gameWindow')
const user = document.querySelector('.user')

document.addEventListener('keydown', (keyEvent) => {
gamePause(keyEvent)
startNewGame(keyEvent)
nextLevel(keyEvent)
})


//Create multiple aliens
function createAliens() {
    for (let i = 0; i < alienRows; i++) {
        for (let j = 0; j < alienCount/alienRows; j++) {
            createAlien(i, j)
        }
    }
}


//Create one alien
function createAlien(row, col) {
    const alien = document.createElement('div')
    alien.classList.add('alien')
    alien.classList.add(`row-${row}`)
    alien.style.bottom = 300 + row*60 +'px'
    alien.style.left = 350 + col*60 +'px'
    gameWindow.appendChild(alien)
}


//Create new bullet
function createBullet() {
    const bullet = document.createElement('div')
    bullet.classList.add('bullet')
    let userPosition = getComputedStyle(user)
    let userBottom = userPosition.getPropertyValue('bottom')
    let userLeft = userPosition.getPropertyValue('left')
    bullet.style.bottom = Number(userBottom.replace('px', '')) + 15 + 'px'
    bullet.style.left = Number(userLeft.replace('px', '')) + 15 + 'px'
    gameWindow.appendChild(bullet)
    
}

//Select shooting alien(s)
function selectShootingAlien() {
    let lowestAliens = document.querySelectorAll('.alien')
    let random = Math.floor(Math.random()*lowestAliens.length)
    return lowestAliens[random]
}



//Create new alien bullet
function createAlienBullet() {
        const alienBullet = document.createElement('div')
        alienBullet.classList.add('alien-bullet')
        let shooter = selectShootingAlien()
        if (shooter) {
            alienBullet.style.left = shooter.style.left
            alienBullet.style.bottom = shooter.style.bottom
            gameWindow.appendChild(alienBullet) 
        }
 
}


//Move bullets
function moveBullets() {
    //move user bullets
    let bullets = document.querySelectorAll('.bullet')
    let currentPostition
    bullets.forEach(bullet => {
        currentPostition = Number(bullet.style.bottom.replace('px', ''))
        if (currentPostition > 565) {
            bullet.remove()
        }
        checkCollisions()
        bullet.style.bottom = currentPostition + 20 + 'px'
    })

    //move alien bullets
    let alienBullets = document.querySelectorAll('.alien-bullet')
    let currentABPostition
    alienBullets.forEach(alienBullet => {
        currentABPostition = Number(alienBullet.style.bottom.replace('px', ''))
        if (currentABPostition < 0) {
            alienBullet.classList.add('hit-user')
            setTimeout(()=> {
            alienBullet.remove()   
            },300)
        } else {
            checkCollisions()
            alienBullet.style.bottom = currentABPostition - alienBulletSpeed + 'px'
        }

    })
}


//Move aliens
function moveAliens() {
    let aliens = document.querySelectorAll('.alien, .exploding')
    let currentAlienPostition
    aliens.forEach(alien => {
        currentAlienPostition = Number(alien.style.left.replace('px', ''))
        if (aliensDirection) {
            alien.style.left = currentAlienPostition - 1 + 'px'  
        } else {
            alien.style.left = currentAlienPostition + 1 + 'px'  
        }
        
    })
}


//Check collisions
function checkCollisions() {

    //User bullets VS aliens
    let bullets = document.querySelectorAll('.bullet')
    let aliens = document.querySelectorAll('.alien')

    bullets.forEach(bullet => {
        aliens.forEach(alien => {

            let bulletPositionBottom = Number(bullet.style.bottom.replace('px', ''))
            let bulletPositionLeft = Number(bullet.style.left.replace('px', ''))
            let alienPositionBottom = Number(alien.style.bottom.replace('px', ''))
            let alienPositionLeft = Number(alien.style.left.replace('px', ''))

            if (bulletPositionLeft > alienPositionLeft &&
                 bulletPositionLeft < alienPositionLeft + 50 &&
                  bulletPositionBottom > alienPositionBottom &&
                   bulletPositionBottom < alienPositionBottom + 50) {
                
                bullet.remove()
                if (alien.classList.contains('low-health-alien')) {
                    alien.classList.remove('alien')
                    alien.classList.add('exploding')
                    setTimeout(()=> {
                        alien.remove()    
                    }, 500)
                    scoreCount++

                } else {
                  alien.classList.add('low-health-alien')  
                }
  
                score.innerHTML = `SCORE ${scoreCount}`
                // check for WIN
                if (scoreCount === alienCount) {
                    // setTimeout(()=> {
                    // Object.keys(controller).forEach(key => {
                    //     controller[key].pressed = false
                    // })  
                    gameEnd('win')
                    // }, 500)
                    return
                }
            }
        })
    })

    //Alien bullets VS user
    let alienBullets = document.querySelectorAll('.alien-bullet')

    alienBullets.forEach(alienBullet => {
        
        let alienBulletPositionLeft = Number(alienBullet.style.left.replace('px', ''))
        let alienBulletPositionBottom = Number(alienBullet.style.bottom.replace('px', ''))
        let userPositionLeft = Number(user.style.left.replace('px', ''))
        let userPositionBottom = Number(user.style.bottom.replace('px', ''))


            if (alienBulletPositionLeft > userPositionLeft &&
                 alienBulletPositionLeft < userPositionLeft + 50 &&
                  alienBulletPositionBottom > userPositionBottom &&
                   alienBulletPositionBottom < userPositionBottom + 50) {
                
                alienBullet.classList.remove('alien-bullet')   
                alienBullet.classList.add('hit-user')
                lives--
                setTimeout(()=> {
                    alienBullet.remove()
                },300)
                if (user.classList.contains('low-health')) {
                    document.querySelector('.lives').style.background = 'red'
                    gameEnd('lose')
                    return
                } else {
                    user.classList.add('low-health')
                }
                
            }
        
    })
}


//Controller TODO: add start and pause!!
let controller = {
    'ArrowLeft': {
        pressed: false,
        func: moveLeft
        },
    'ArrowRight': {
        pressed: false,
        func: moveRight
    },
    'ArrowUp': {
        pressed: false,
        func: moveUp
    },
    'ArrowDown': {
        pressed: false,
        func: moveDown
    },
    ' ': {
        pressed: false,
        func: shoot
    },
}


//Eventlisteners for controller keys
document.addEventListener("keydown", (e) => {
    if(controller[e.key]){
      controller[e.key].pressed = true
    }
})

document.addEventListener("keyup", (e) => {
    if(controller[e.key]){
      controller[e.key].pressed = false
    }
})

function executeMoves() {
    Object.keys(controller).forEach(key => {
        if (controller[key].pressed) {
            controller[key].func()
        }
    })
}


//---Controller functions
function moveLeft() {
    let userStyles = window.getComputedStyle(user)
    let leftValue = Number(userStyles.getPropertyValue('left').replace('px', ''))
    if (leftValue >= step) {
       user.style.left = leftValue - step +'px' 
    }
    //user.style.transform = 'translateX(-3px)'
}
function moveRight() {
    let userStyles = window.getComputedStyle(user)
    let leftValue = Number(userStyles.getPropertyValue('left').replace('px', ''))
    if (leftValue <= (gameWidth - step - Number(userStyles.getPropertyValue('width').replace('px', '')))) {
    user.style.left = leftValue + step + 'px'
    }
    //user.style.transform = 'translateX(3px)'
}

function moveUp() {
    let userStyles = window.getComputedStyle(user)
    let bottomValue = Number(userStyles.getPropertyValue('bottom').replace('px', ''))
    if (bottomValue <= (gameHight - Number(userStyles.getPropertyValue('height').replace('px', '')))) {
    user.style.bottom = bottomValue + step +'px' 
    }
    //user.style.transform = 'translateY(-3px)'
}

function moveDown() {
    let userStyles = window.getComputedStyle(user)
    let bottomValue = Number(userStyles.getPropertyValue('bottom').replace('px', ''))
    if (bottomValue >= step) {
    user.style.bottom = bottomValue - step + 'px'
    }
    //user.style.transform = 'translateY(3px)'
}


//---shooting speed regulator---
let timer = true
function shoot(){
    if (timer) {
       createBullet()
       timer = false
       setTimeout(()=> {
           timer = true
       }, 200) 
    }
}


//---main loop---
function drawFrame(timeStamp){
        if (timeStamp) {
        let timeDifference = timeStamp - prevFrameTimeStamp
        if (timeDifference*60 < 1000) {
            console.log(timeDifference)
        }
        prevFrameTimeStamp = timeStamp
    }
    gameOn = requestAnimationFrame(drawFrame)
    //measures and logs time between frames


    executeMoves()
    alienDirectionChanger()
    moveAliens()
    moveBullets()

    document.querySelector('.level').innerHTML = `LEVEL ${level}`
    if (lives === 0) {

    }
    document.querySelector('.lives').innerHTML = `LIVES ${lives}`

    playTime = new Date().getTime() - startTime - pauseDuration
    
    if (gameTime - Math.floor(playTime/1000) > 0) {
       timeCounter.textContent = `TIME ${gameTime - Math.floor(playTime/1000)}` 
    } else {
        timeCounter.textContent = 'TIMES UP'
        timeCounter.style.background = 'red'
        gameEnd('lose') 
    }
    
}


//pauses game (stops new frames being drawn, halts time)
let paused = false
function gamePause(event) {
    if (event && event.key === 'p') {
        if (!paused) {
            cancelAnimationFrame(gameOn)
            clearIntervals()
            paused = true
            pauseStart = new Date().getTime()
            document.querySelector('.pause-menu').style.opacity = '1'
        } else {
            drawFrame()
            setIntervals()
            paused = false
            currentPauseDuration = new Date().getTime() - pauseStart
            pauseDuration += currentPauseDuration
            document.querySelector('.pause-menu').style.opacity = '0'

        }
    }
}

//Game end (win or lose)
function gameEnd(status) {
    console.log("Game ended")

    clearIntervals()
    cancelAnimationFrame(gameOn)   
    user.style.opacity = '0'

    document.querySelectorAll('.bullet, .alien-bullet, .alien').forEach(object => {
        object.remove()
    })

    gameWindow.classList.add('game-end')
    pauseStart = new Date().getTime() // tesing if pauseStart here stops time
    switch (status) {
        case 'win':
            document.querySelector('.win-msg').style.opacity = "1"
            break
        case 'lose':
            document.querySelector('.lose-msg').style.opacity = "1"
            break
    }
}


//Starts New Game
function startNewGame(keyEvent) {
    if (keyEvent.key === 'y') {
        if (paused) {
            gamePause({key: 'p'})
        }
        lives = 2
        document.querySelector('.start-msg').style.opacity = '0'
        gameEnd('lose') // reset
        scoreCount = 0
        score.innerHTML = `SCORE ${scoreCount}`
        console.log('NEW GAME')
        startTime = new Date().getTime()
        user.style.opacity = '1'
        user.classList.remove('low-health')
        createAliens()
        pauseDuration = 0
        drawFrame()
        setIntervals()

        timeCounter.style.background = 'black'
        document.querySelector('.lives').style.background = 'black'

        gameWindow.classList.remove('game-end')
        let win = document.querySelector('.win-msg')
        let lose = document.querySelector('.lose-msg')
        win.style.opacity = '0'
        lose.style.opacity = '0'
    }
}

//Next level
function nextLevel(keyEvent) {
    if (keyEvent.key === 'n' && level < 2) {
        level++
        for (let i=0;i<level;i++) {
        alienCount += 6
        alienBulletSpeed += 3
        gameTime -= 5
        }
        gameEnd('lose')
        startNewGame({key: 'y'})
        document.querySelector('.level').innerHTML = `level ${level}`
    }

}