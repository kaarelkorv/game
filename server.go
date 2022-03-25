package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type player struct {
	Name string `json:"name"`
	Score float64 `json:"score"`
	Time int `json:"time"`
	Ammo int `json:"ammo"`
}
var incomingPlayer player
var players []player

//add player to correct position
func addplayer(new player) {
	if (len(players) == 0) {
	players = append(players, new)
	return
	}

	fmt.Println(new)
	var temp []player
	haveInserted := false

	for i := 0; i < len(players); i++ {
		if (!haveInserted) {
			if (new.Score < players[i].Score) {
				temp = append(temp, players[i])
			} else if (new.Score >= players[i].Score){
				temp = append(temp, new)
				haveInserted = true
				temp = append(temp, players[i])
			}
		} else {
			temp = append(temp, players[i])
		}
		
	}
	if (!haveInserted) {
		temp = append(temp, new)
	}
	fmt.Println("temp:", temp)
	players = nil
	players = append(players, temp...)
	temp = nil
	haveInserted = false
}

func main() {
	http.HandleFunc("/api", requestHandler)

	fmt.Printf("Starting server at port 8080\n")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

//handle client requests
func requestHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Method)

	switch (r.Method) {
		case "POST":
		w.Header().Set("Access-Control-Allow-Origin", "*") //sets the header to allow cors
		//read, unmarshal and append posted information
		body, _ := io.ReadAll(r.Body)
		if err := json.Unmarshal(body, &incomingPlayer); err != nil {
			panic(err)
		}
		addplayer(incomingPlayer)

		
		//Marshal updated list and write to response
		json.Marshal(players)
		json.NewEncoder(w).Encode(players)
		case "GET":
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.Marshal(players)
		json.NewEncoder(w).Encode(players)
	}
}