
import { user } from './user.js'
import { gameEnd, increaseScoreCount, reduceLives } from './main.js'

//Check collisions + animate collisions
export function checkCollisions() {

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
                    increaseScoreCount()

                } else {
                  alien.classList.add('low-health-alien')  
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
                reduceLives()
                setTimeout(()=> {
                    alienBullet.remove()
                },300)
                if (user.classList.contains('low-health')) {
                    document.querySelector('.lives').style.background = "rgb(255, 255, 255, 0.5)"
                    gameEnd('lose')
                    return
                } else {
                    user.classList.add('low-health')
                }
                
            }
        
    })
}