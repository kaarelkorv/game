let prevFrameTimeStamp = 0
let gameOn
const gameWidth = 1200
const gameHight = 600
const step = 5
const alienCount = 3
const alienRows = 3
let score = document.querySelector('.score')
let scoreCount = 0


const gameWindow = document.querySelector('.gameWindow')
const user = document.querySelector('.user')

document.addEventListener('keydown', (keyEvent) => gameOff(keyEvent))

function createAliens() {
    for (let i=0;i<alienRows;i++) {
        for (let j=0;j<alienCount/alienRows;j++) {
        createAlien(i, j)
    }
    }

}



//create Alien
function createAlien(row, col) {
    const alien = document.createElement('div')
    alien.classList.add('alien')
    alien.style.bottom = 300 + row*60 +'px'
    alien.style.left = 250 + col*60 +'px'
    gameWindow.appendChild(alien)
}


//create new bullet
function createBullet() {
    const bullet = document.createElement('div')
    bullet.classList.add('bullet')
    let userPosition = getComputedStyle(user)
    let userBottom = userPosition.getPropertyValue('bottom')
    let userLeft = userPosition.getPropertyValue('left')
    bullet.style.bottom = userBottom
    bullet.style.left = userLeft
    gameWindow.appendChild(bullet)
    
}

//move bullets
function moveBullets() {
    let bullets = document.querySelectorAll('.bullet')
    let bulletPosition
    let currentPostition
    bullets.forEach(bullet => {
        bulletPosition = getComputedStyle(bullet)
        currentPostition = bulletPosition.getPropertyValue('bottom').replace('px', '')
        if (currentPostition > 650) {
            bullet.remove()
        }
        checkCollisions()
        bullet.style.bottom = Number(currentPostition) + 15 + 'px'
    })
}

//checkCollisions
function checkCollisions() {
    let bullets = document.querySelectorAll('.bullet')
    let aliens = document.querySelectorAll('.alien')

    bullets.forEach(bullet => {
        aliens.forEach(alien => {

            // SUPER SLOW
            // let bulletStyles = getComputedStyle(bullet)
            // let bulletPositionBottom = Number(bulletStyles.getPropertyValue('bottom').replace('px', ''))
            // let bulletPositionLeft = Number(bulletStyles.getPropertyValue('left').replace('px', ''))
            // let alienStyles = getComputedStyle(alien)
            // let alienPositionBottom = Number(alienStyles.getPropertyValue('bottom').replace('px', ''))
            // let alienPositionLeft = Number(alienStyles.getPropertyValue('left').replace('px', ''))

            let bulletPositionBottom = Number(bullet.style.bottom.replace('px', ''))
            let bulletPositionLeft = Number(bullet.style.left.replace('px', ''))
            let alienPositionBottom = Number(alien.style.bottom.replace('px', ''))
            let alienPositionLeft = Number(alien.style.left.replace('px', ''))


            if (bulletPositionLeft > alienPositionLeft && bulletPositionLeft < alienPositionLeft + 50 && bulletPositionBottom > alienPositionBottom && bulletPositionBottom < alienPositionBottom + 50) {
                alien.remove()
                bullet.remove()
                scoreCount++
                score.innerHTML = `${scoreCount}`
                // check for WIN
                if (scoreCount === alienCount) {
                    setTimeout(()=> {
                    gameOff()
                    alert("You win!!!")  
                    }, 500)
                    
                }
            }
        })
    })
}




//controller TODO: add start and pause!!
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

//eventlisteners for controller keys
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

//---Controller functions---

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

//---Shooting speed regulator---
let timer = true
function shoot(){
    if (timer) {
       createBullet()
       timer = false
       setTimeout(()=> {
           timer = true
       }, 100) 
    }
}


//---Main loop---
function drawFrame(timeStamp){
//measures and logs time between framews
    // if (timeStamp) {
    //     let timeDifference = timeStamp - prevFrameTimeStamp
    //     if (timeDifference*60 < 1000) {
    //         console.log(timeDifference)
    //     }
    //     prevFrameTimeStamp = timeStamp
    // }

    executeMoves()
    moveBullets()
    



    gameOn = requestAnimationFrame(drawFrame)
}



//stops game (stops new frames being drawn)
function gameOff(event) {
    if (event && event.key === 'p') {
        cancelAnimationFrame(gameOn)
    }
}



//starts gameloop
createAliens()
drawFrame()