import { level } from './main.js'

const alienRows = 3
export let alienBulletSpeed = {
    speed: 5,
    increaseSpeed: function() {this.speed += 3}
}

export let alienCount = {
    count: 12,
    increaseCount: function() {this.count += 6}
}

export let aliensDirection = {
    status: true,
    setTrue: ()=> {
        aliensDirection.status = true
    }
} // aliens moving left or right
export let alienSwingPosition = {
    position: 0,
    reset: ()=>{alienSwingPosition.position = 0}
}

let alienSwingSpeed = 1
let gameWindow = document.querySelector('.gameWindow')

//Aliens direction changer
export function alienDirectionChanger() {
    if (alienSwingPosition.position === 50 || alienSwingPosition.position === -50) {
    
        if (aliensDirection.status) {
        aliensDirection.status = false
        } else {
        aliensDirection.status = true
        }
    }
}

//Create multiple aliens
export function createAliens() {
    for (let i = 0; i < alienRows; i++) {
        for (let j = 0; j < alienCount.count/alienRows; j++) {
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

//Select shooting alien(s)
function selectShootingAlien() {
    let aliveAliens = document.querySelectorAll('.alien')
    let random = Math.floor(Math.random()*aliveAliens.length)
    return aliveAliens[random]
}

//Create new alien bullet
export function createAlienBullet() {
    if (alienSwingPosition.position === 25 || alienSwingPosition.position === -25) {
        const alienBullet = document.createElement('div')
        alienBullet.classList.add('alien-bullet')
        let shooter = selectShootingAlien()
        if (shooter) {
            alienBullet.style.transform = shooter.style.transform
            gameWindow.appendChild(alienBullet) 
        }
    }
}

//Move aliens
export function moveAliens() {
    let aliens = document.querySelectorAll('.alien, .exploding')
    let currentAlienXposition
    let currentAlienYposition
    aliens.forEach(alien => {
        currentAlienXposition = Number(alien.style.transform.split(', ')[0].replace('translate(', '').replace('px', ''))
        currentAlienYposition = Number(alien.style.transform.split(', ')[1].replace('px)', ''))
        if (aliensDirection.status) {
            alien.style.transform = `translate(${currentAlienXposition - level - alienSwingSpeed}px, ${currentAlienYposition}px)`
        } else {
            alien.style.transform = `translate(${currentAlienXposition + level + alienSwingSpeed}px, ${currentAlienYposition}px)` 
        }
    })

    if (aliensDirection.status) {
        alienSwingPosition.position--
    } else {
        alienSwingPosition.position++
    }

}

//Move alien bullets
export function moveAlienBullets() {
     
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
             alienBullet.style.transform = `translate(${currentABXposition}px, ${currentABYposition + alienBulletSpeed.speed}px)`
         }
 
     })
}