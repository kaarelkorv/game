import { totalScore, totalTimeBonus} from './main.js'
import { bulletsUsed } from './user.js'

let page = 0

const dialog = document.querySelector('.modal')
document.querySelector('.close-modal').addEventListener('click', ()=> {
    const playerName = document.getElementById('player-name').value
    let playerResult = {
        name: playerName,
        score: totalScore - bulletsUsed*0.1,
        time: totalTimeBonus,
        ammo: bulletsUsed
    }
    document.querySelector('#player-form').style.display = "none"
    const playerResultJSON = JSON.stringify(playerResult)
    getScoreTable(playerResultJSON)
    document.querySelector('.score-table').style.opacity = 1
})

//Post player info to API and recieve updated list in return
async function getScoreTable (data) {
    const response = await fetch('http://localhost:8080/api', {
        method: 'POST',
        body: data
    })
    const list = await response.json()
    console.log(list)
    showScoreTable(list, 0)
    addPages(list)
}

function showScoreTable(list, page) {
    const scoreTable = document.querySelector('.score-table')
    scoreTable.childNodes.forEach(child => {child.remove()})
    scoreTable.innerHTML = `
    <tr>
    <th>RANKING</th>
    <th>NAME</th>
    <th>SCORE</th>
    <th>TIMEBONUS</th>
    <th>USED AMMO</th> 
    </tr>
    `
    list.forEach((element, index) => {
        if (index >= page*5 && index < page*5 + 5) {

            const score = () => {
                let nums = (element.score).toString().split('.')
                if (nums[1] === undefined) {
                    nums[1] = 0
                } else {
                    nums[1] = nums[1].split('').slice(0, 1).join('')
                }

                return nums[0] + '.' + nums[1]
            }
            
            scoreTable.insertAdjacentHTML("beforeend", 
            `<tr>
            <td>${index +1}</td>
            <td>${element.name}</td>
            <td>${score()}</td>
            <td>${element.time}</td>
            <td>${element.ammo}</td>
             </tr>`
            )
        }
     });
}

function addPages(list) {
    let pageCount = list.length / 5
    const pagesContainer = document.querySelector('.pages-container')
    pagesContainer.style.opacity = "1"
    pagesContainer.style.display = "flex"
    for (let i=0;i<pageCount;i++) {
        const nextPage = document.createElement('div')
        nextPage.classList.add('page-number')
        nextPage.textContent = `${i}`
        nextPage.addEventListener('click', ()=> {
            showScoreTable(list, i)
            document.querySelectorAll('.page-number').forEach(element => {
                element.style.transform = "none"
            })
            nextPage.style.transform = "scale(1.1)"
        })


        pagesContainer.appendChild(nextPage)
    }

}

export function clearModal () {
    dialog.close()
    page = 0
    document.querySelector('#player-form').style.display = "block"
    const table = document.querySelector('.score-table')
    Array.from(table.children).forEach(child => child.remove())
    const pagesContainer = document.querySelector('.pages-container')
    let children = pagesContainer.children
    Array.from(children).forEach(child => child.remove())
}