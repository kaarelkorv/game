let prevFrameTimeStamp = 0
let gameOn = 'stopped'
const gameWidth = 1200
const gameHight = 600
const step = 5
let alienCount = 12
const alienRows = 3
let scoreCount = 0
let playTime = 0
let startTime
let pauseDuration = 0
let pauseStart //marks the time when "p" was last hit
let aliensDirection = true // aliens moving left or right

let alienSwingPosition = 0
let gameTime = 6 // time in seconds
let alienBulletSpeed = 6
let userBulletSpeed = 14
let level = 0
let levelsCompleted = 0
let lives = 2




//Aliens direction changer
function alienDirectionChanger() {
    if (aliensDirection) {
        aliensDirection = false
    } else {
        aliensDirection = true
    }
}

const score = document.querySelector('.score')
const timeCounter = document.querySelector('.timeCounter')
let gameWindow = document.querySelector('.gameWindow')

const user = document.querySelector('.user')
let userXposition = 600
let userYposition = -45
user.style.transform = `translate(${userXposition}px, ${userYposition}px)`

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
    alien.style.transform = `translate(${500 - (level+level)*50 + col*60}px, ${-320 - row*60}px)`
    gameWindow.appendChild(alien)
}


//Create new userbullet
function createBullet() {
    const bullet = document.createElement('div')
    bullet.classList.add('bullet')
    bullet.style.transform = user.style.transform
    gameWindow.appendChild(bullet)
}

//Select shooting alien(s)
function selectShootingAlien() {
    let aliveAliens = document.querySelectorAll('.alien')
    let random = Math.floor(Math.random()*aliveAliens.length)
    return aliveAliens[random]
}



//Create new alien bullet
function createAlienBullet() {
        const alienBullet = document.createElement('div')
        alienBullet.classList.add('alien-bullet')
        let shooter = selectShootingAlien()
        if (shooter) {
            alienBullet.style.transform = shooter.style.transform
            gameWindow.appendChild(alienBullet) 
        }
 
}


//Move bullets
function moveBullets() {
    //move user bullets
    let bullets = document.querySelectorAll('.bullet')
    let currentXposition
    let currentYposition
    bullets.forEach(bullet => {
        currentXposition = Number(bullet.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
        currentYposition = Number(bullet.style.transform.split(', ')[1].replace('px)', ''))
        if (currentYposition < -565) {
            bullet.remove()
        }
        checkCollisions()
        bullet.style.transform = `translate(${currentXposition}px, ${currentYposition - userBulletSpeed}px)`
    })

    //move alien bullets
    let alienBullets = document.querySelectorAll('.alien-bullet')
    let currentABXposition
    let currentABYposition
    alienBullets.forEach(alienBullet => {
        currentABXposition = Number(alienBullet.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
        currentABYposition = Number(alienBullet.style.transform.split(', ')[1].replace('px)', ''))

        if (currentABYposition > -20) {
            alienBullet.classList.add('hit-user')
            setTimeout(()=> {
            alienBullet.remove()   
            },300)
        } else {
            checkCollisions()
            alienBullet.style.transform = `translate(${currentABXposition}px, ${currentABYposition + alienBulletSpeed}px)`
        }

    })
}


//Move aliens
function moveAliens() {
    let aliens = document.querySelectorAll('.alien, .exploding')
    let currentAlienXposition
    let currentAlienYposition
    aliens.forEach(alien => {
        currentAlienXposition = Number(alien.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
        currentAlienYposition = Number(alien.style.transform.split(', ')[1].replace('px)', ''))
        if (aliensDirection) {
            alien.style.transform = `translate(${currentAlienXposition - level - 1}px, ${currentAlienYposition}px)`
        } else {
            alien.style.transform = `translate(${currentAlienXposition + level + 1}px, ${currentAlienYposition}px)` 
        }
    })

    if (aliensDirection) {
        alienSwingPosition--
    } else {
        alienSwingPosition++
    }

}


//Check collisions
function checkCollisions() {

    //User bullets VS aliens
    let bullets = document.querySelectorAll('.bullet')
    let aliens = document.querySelectorAll('.alien')

    bullets.forEach(bullet => {
        aliens.forEach(alien => {

            let bulletPositionX = Number(bullet.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
            let bulletPositionY = Number(bullet.style.transform.split(', ')[1].replace('px)', ''))
            let alienPositionX = Number(alien.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
            let alienPositionY = Number(alien.style.transform.split(', ')[1].replace('px)', ''))

            if (bulletPositionX + 5 > alienPositionX &&
                 bulletPositionX + 5 < alienPositionX + 40 &&
                  bulletPositionY > alienPositionY &&
                   bulletPositionY < alienPositionY + 40) {
                
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
                    gameEnd('win')
                    levelsCompleted = level + 1
                    return
                }
            }
        })
    })

    //Alien bullets VS user
    let alienBullets = document.querySelectorAll('.alien-bullet')

    alienBullets.forEach(alienBullet => {
        
        let alienBulletPositionX = Number(alienBullet.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
        let alienBulletPositionY = Number(alienBullet.style.transform.split(', ')[1].replace('px)', ''))
        let userPositionX = Number(user.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
        let userPositionY = Number(user.style.transform.split(', ')[1].replace('px)', ''))


            if (alienBulletPositionX + 5 > userPositionX &&
                 alienBulletPositionX + 5 < userPositionX + 40 &&
                  alienBulletPositionY + 20 > userPositionY &&
                   alienBulletPositionY < userPositionY + 40) {
                
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


//Controller
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


//Controller functions

let userPositionX = Number(user.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
let userPositionY = Number(user.style.transform.split(', ')[1].replace('px)', ''))

function moveLeft() {
    if (userXposition >= step) {
        userXposition -= step
        user.style.transform = `translate(${userXposition}px, ${userYposition}px` 
    }

}
function moveRight() {
    if (userXposition <= gameWidth - step - 40) {
        userXposition += step
        user.style.transform = `translate(${userXposition}px, ${userYposition}px` 
    }

}

function moveUp() {
    if (userYposition >= -gameHight) {
        userYposition -= step
        user.style.transform = `translate(${userXposition}px, ${userYposition}px`  
    }

}

function moveDown() {
    if (userYposition <= -40 - step) {
        userYposition += step
        user.style.transform = `translate(${userXposition}px, ${userYposition}px` 
    }

}


//---shooting speed regulator---
let timer = true
function shoot(){
    if (timer) {
       createBullet()
       timer = false
       setTimeout(()=> {
           timer = true
       }, 400) 
    }
}


//---main loop---
function drawFrame(timeStamp){

    //measures and logs time between frames
    if (timeStamp) {
        let timeDifference = timeStamp - prevFrameTimeStamp
        prevFrameTimeStamp = timeStamp
        console.log(timeDifference)
    }
    const fps = 60
    const fpsTimeout = setTimeout(()=>{
        gameOn = requestAnimationFrame(drawFrame)
         
        //switch alien swing side from left to right to left
    if (alienSwingPosition === 50 || alienSwingPosition === -50) {
        alienDirectionChanger()
     } else if (
         alienSwingPosition === 0 ||
         alienSwingPosition === 75 ||
         alienSwingPosition === -75) {
             createAlienBullet()
     }
 
     executeMoves()
     moveAliens()
     moveBullets()
 
     //display information and check for time up
     document.querySelector('.level').innerHTML = `LEVEL ${level}`
     if (lives === 0) {
 
     }
     document.querySelector('.lives').innerHTML = `LIVES ${lives}`
 
     playTime = new Date().getTime() - startTime - pauseDuration
     
     if (gameTime - Math.floor(playTime/1000) > 0) {
        timeCounter.textContent = `TIME ${gameTime - Math.floor(playTime/1000)}s` 
     } else {
         timeCounter.textContent = 'TIMES UP'
         timeCounter.style.background = 'red'
         gameEnd('lose') 
     }



    },1000/fps)

}


//pauses game (stops new frames being drawn, halts time)
let paused = false
function gamePause(event) {
    if (event && event.key === 'p' && playTime !== 0) {
        if (!paused) {
            cancelAnimationFrame(gameOn)
            gameOn = 'stopped'
            paused = true
            pauseStart = new Date().getTime()
            document.querySelector('.pause-menu').style.opacity = '1'
        } else {
            paused = false
            currentPauseDuration = new Date().getTime() - pauseStart
            pauseDuration += currentPauseDuration
            document.querySelector('.pause-menu').style.opacity = '0'
            drawFrame()
        }
    }
}

//Game end (win or lose)
function gameEnd(status) {
    console.log("Game ended")
    if (level === 2) {
        document.querySelector('.next-level').style.opacity = '0'
    }

    cancelAnimationFrame(gameOn)
    console.log("GAMEON IS:", gameOn)
    gameOn = 'stopped'   
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
    if (keyEvent.key === 'y' && gameOn === 'stopped') {
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
        
        aliensDirection = true
        alienSwingPosition = 0


        timeCounter.style.background = 'black'
        document.querySelector('.lives').style.background = 'black'

        gameWindow.classList.remove('game-end')
        let win = document.querySelector('.win-msg')
        let lose = document.querySelector('.lose-msg')
        win.style.opacity = '0'
        lose.style.opacity = '0'
        drawFrame()
    }
}

//Next level
function nextLevel(keyEvent) {
    if (keyEvent.key === 'n' && level < 2 && levelsCompleted - 1 === level && level <= 1) {
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