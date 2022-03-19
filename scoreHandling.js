// at game-end prompt player for name and on submit, save this info to an object. convert to JSON and send a POST request to API

//go API service
//server that when endpoint is accessed, determines if request is POST, if its valid JSON, save to MySQL database
// if request is GET, return all db as JSON

import { totalScore, timeBonus, totalAssignedGameTime } from './main.js'
import { bulletsUsed } from './user.js'

const dialog = document.querySelector('.modal')
document.querySelector('.close-modal').addEventListener('click', ()=> {
    const playerName = document.getElementById('player-name').value
    let playerResult = {
        name: playerName,
        score: totalScore - bulletsUsed*0.1,
        time: totalAssignedGameTime - timeBonus,
        ammo: bulletsUsed
    }

    const playerResultJSON = JSON.stringify(playerResult)

    console.log(playerResultJSON)
    dialog.close()  
})