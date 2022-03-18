import { checkCollisions } from './collisions.js'
import { 
    moveUserBullets, 
    executeMoves, 
    user } from './user.js'
import { 
    moveAlienBullets,
    moveAliens, 
    createAliens, 
    aliensDirection, 
    alienSwingPosition, 
    createAlienBullet,
    alienCount, 
    alienDirectionChanger,
    alienBulletSpeed} from './aliens.js'


//Game window
export const gameWidth = 1200
export const gameHight = 600
let gameWindow = document.querySelector('.gameWindow')
let win = document.querySelector('.win-msg')
let lose = document.querySelector('.lose-msg')

//Frames
let frameId
let prevFrameTimeStamp = 0
export let frameLength = 16

//Time
let assignedGameTime = 60 // time in seconds
const timeCounter = document.querySelector('.timeCounter')
let gameDuration = 0
let startTime

//Pause
let paused = false
let pauseStart
let currentPauseDuration
let totalPauseDuration = 0

//Levels
export let level = 0
let levelsCompleted = 0

//Score
let scoreCount = 0
export function increaseScoreCount() { scoreCount++ }
const scoreCounter = document.querySelector('.score')

//Lives
let lives = 2
export function reduceLives() { lives-- }
const livesCounter = document.querySelector('.lives')

// Listen for any keystroke
document.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case 'y':
            startNewGame()
            break
        case 'p':
            gamePause()
            break
        case 'n':
            nextLevel()
            break
    }
})

//Pause game if user leaves tab/window
document.addEventListener("visibilitychange", ()=> {
    if (!paused) {
        gamePause()
    }
});

//Checks if user has won
function checkForEnd() {
    if (scoreCount === alienCount.count) {
        gameEnd('win')
        levelsCompleted = level + 1
    }    
    if ((assignedGameTime - gameDuration) <= 0) {  
        timeCounter.textContent = 'TIMES UP'
        timeCounter.style.background = 'red'
        gameEnd('lose')
   }
}

//Main loop
function drawFrame(timeStamp){
    frameId = requestAnimationFrame(drawFrame)
    //measures and logs time between printed frames
    if (timeStamp) {
        frameLength = timeStamp - prevFrameTimeStamp
        prevFrameTimeStamp = timeStamp
    }

    createAlienBullet()
    executeMoves()
    moveAlienBullets()
    moveUserBullets()
    checkCollisions()
    moveAliens()
    alienDirectionChanger()
 
     scoreCounter.innerHTML = `SCORE ${scoreCount}`
     livesCounter.innerHTML = `LIVES ${lives}`
     gameDuration = Math.floor((new Date().getTime() - startTime - totalPauseDuration)/1000)
     timeCounter.textContent = `TIME ${assignedGameTime - gameDuration}s` 

    checkForEnd()
}

//Pause game
function gamePause() {
    if (gameDuration !== 0) {
        if (!paused) {
            cancelAnimationFrame(frameId)
            paused = true
            pauseStart = new Date().getTime()
            document.querySelector('.pause-menu').style.opacity = '1'
        } else {
            paused = false
            currentPauseDuration = new Date().getTime() - pauseStart
            totalPauseDuration += currentPauseDuration
            document.querySelector('.pause-menu').style.opacity = '0'
            drawFrame()
        }
    }
}

//Game end (win or lose)
export function gameEnd(status) {
    cancelAnimationFrame(frameId)

    if (level === 2) {
        document.querySelector('.next-level').style.opacity = '0'
    }
    user.style.opacity = '0'
    document.querySelectorAll('.bullet, .alien-bullet, .alien').forEach(object => {
        object.remove()
    })

    gameWindow.classList.add('game-end')
    //pauseStart = new Date().getTime() // tesing if pauseStart here stops time
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
function startNewGame() {
    if (paused || gameWindow.classList.contains('game-end') || frameId === undefined) {
        if (paused) {
            //remove pause
            paused = false
            currentPauseDuration = new Date().getTime() - pauseStart
            totalPauseDuration += currentPauseDuration
            document.querySelector('.pause-menu').style.opacity = '0'    
        }
        
        gameEnd('lose') // clear table

        //reset aliens
        createAliens()
        aliensDirection.setTrue()
        alienSwingPosition.reset()

        //reset user
        user.style.opacity = '1'
        user.classList.remove('low-health')
        lives = 2

        //reset score
        scoreCount = 0
        scoreCounter.innerHTML = `SCORE ${scoreCount}`

        //reset time
        startTime = new Date().getTime()
        totalPauseDuration = 0
        
        //reset visuals
        timeCounter.style.background = 'black'
        document.querySelector('.lives').style.background = 'black'
        gameWindow.classList.remove('game-end')
        document.querySelector('.start-msg').style.opacity = '0'
        win.style.opacity = '0'
        lose.style.opacity = '0'
        
        drawFrame()
    }
}

//Next level
function nextLevel() {
    if (level < 2 && levelsCompleted - 1 === level) {
        level++
        document.querySelector('.level').innerHTML = `LEVEL ${level}`
        for (let i = 0; i < level; i++) {
            alienCount.increaseCount()
            alienBulletSpeed.increaseSpeed()
            assignedGameTime -= 5
        }
        startNewGame()
    }
}