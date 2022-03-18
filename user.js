import { gameHight, gameWidth} from './main.js'

export const user = document.querySelector('.user')
//Starting position
let userXposition = 600
let userYposition = -45
user.style.transform = `translate(${userXposition}px, ${userYposition}px)`
let userBulletSpeed = 5
let step = 5
let gameWindow = document.querySelector('.gameWindow')

//Controller for user moves
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

//Eventlisteners for controller{} keys
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

//Change controller pressed values and execute assigned function
export function executeMoves() {
    Object.keys(controller).forEach(key => {
        if (controller[key].pressed) {
            controller[key].func()
        }
    })
}


//Controller functions
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

//Move user bullets
export function moveUserBullets() {
    
    let bullets = document.querySelectorAll('.bullet')
    let currentXposition
    let currentYposition
    bullets.forEach(bullet => {
        currentXposition = Number(bullet.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
        currentYposition = Number(bullet.style.transform.split(', ')[1].replace('px)', ''))
        if (currentYposition < -565) {
            bullet.remove()
        }
        bullet.style.transform = `translate(${currentXposition}px, ${currentYposition - userBulletSpeed}px)`
    })
}

//Create new userbullet
function createBullet() {
    const bullet = document.createElement('div')
    bullet.classList.add('bullet')
    bullet.style.transform = user.style.transform
    gameWindow.appendChild(bullet)
}

//User shooting + shooting speed regulator
let timer = true
export function shoot(){
    if (timer) {
       createBullet()
       timer = false
       setTimeout(()=> {
           timer = true
       }, 400) 
    }
}