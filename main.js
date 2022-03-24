import { checkCollisions } from './collisions.js'
import './scoreHandling.js'
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
export let totalAssignedGameTime = 0
export let timeBonus = 0

//Pause
let paused = false
let pauseStart
let currentPauseDuration
let totalPauseDuration = 0

//Levels
export let level = 2
let levelsCompleted = 0
const levelCounter = document.querySelector('.level')

//Score
export let totalScore = 0
let levelScoreCount = 0
export function increaseScoreCount() { levelScoreCount++ }
const scoreCounter = document.querySelector('.score')
const totalScoreCounter = document.querySelector('.total-score')

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
    if (levelScoreCount === alienCount.count) {
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
 
 
    levelCounter.innerHTML = `LEVEL ${level}`
    scoreCounter.innerHTML = `SCORE ${levelScoreCount}`
    livesCounter.innerHTML = `LIVES ${lives}`
    gameDuration = Math.floor((new Date().getTime() - startTime - totalPauseDuration)/1000)
    timeCounter.textContent = `TIME ${assignedGameTime - gameDuration}s` 
    totalScoreCounter.textContent = `TS: ${totalScore + levelScoreCount} (kills: ${totalScore-timeBonus}) (time left over: ${timeBonus})` 

    checkForEnd()
}

//Pause game
function gamePause() {
    if (gameDuration !== 0 && gameDuration !== assignedGameTime && !gameWindow.classList.contains('game-end')) {
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
    
    switch (status) {
        case 'win':
            if (level === 2) {
                scoreCalc()
                document.querySelector('.modal').showModal()
            }
            document.querySelector('.win-msg').style.opacity = "1"
            break
        case 'lose':
            document.querySelector('.lose-msg').style.opacity = "1"
            break
    }

}


//Start new game
function startNewGame() {
    if (paused || gameWindow.classList.contains('game-end') && levelsCompleted <= 2 || frameId === undefined) {
        //if paused, remove pause
        if (paused) {
            paused = false
            currentPauseDuration = new Date().getTime() - pauseStart
            totalPauseDuration += currentPauseDuration
            document.querySelector('.pause-menu').style.opacity = '0'    
        }
        //go to square one
        if (lives === 0 || gameDuration === assignedGameTime) {
            level = 0
            levelsCompleted = 0
            totalScore = 0
            alienCount.resetCount()
            alienBulletSpeed.resetSpeed()
            assignedGameTime = 60
            timeBonus = 0
        }

        lives = 2

        //reset aliens
        createAliens()
        aliensDirection.setTrue()
        alienSwingPosition.reset()

        //reset user
        user.style.opacity = '1'
        user.classList.remove('low-health')

        //reset score
        levelScoreCount = 0
        scoreCounter.innerHTML = `SCORE ${levelScoreCount}`

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
        scoreCalc()
        level++
        document.querySelector('.level').innerHTML = `LEVEL ${level}`
        // for (let i = 0; i < level; i++) {
        //     alienCount.increaseCount()
        //     alienBulletSpeed.increaseSpeed()
        //     totalAssignedGameTime += assignedGameTime
        //     assignedGameTime -= 5
        // }
        startNewGame()
    }
}

function scoreCalc() {
    totalScore += levelScoreCount + assignedGameTime - gameDuration
    timeBonus += assignedGameTime - gameDuration
}