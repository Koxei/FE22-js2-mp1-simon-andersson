// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjn44wvg1QjBxQBavb9ntxFLjGTSiC-nY",
  authDomain: "rps-game-88bfe.firebaseapp.com",
  projectId: "rps-game-88bfe",
  storageBucket: "rps-game-88bfe.appspot.com",
  messagingSenderId: "422195194054",
  appId: "1:422195194054:web:ddda01bf329ff250188fc7",
  measurementId: "G-HT3520BNBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const reference = ref(db, 'Highscore/');
const dbURL = 'https://rps-game-88bfe-default-rtdb.europe-west1.firebasedatabase.app/Highscore/.json';
const hsTemplate = document.querySelector('#highscoreTemplate');
const templateContainer = document.querySelector('#templateContainer');
const playerStats = {};

let input = document.getElementById("playerNameInput");
let btn = document.getElementById("btn");


fetch(dbURL)
.then(res => res.json())
.then(data => displayHighscoreList(data))

const displayHighscoreList = (users) => {

  
    users.forEach(user => {
      let clone = hsTemplate.content.cloneNode(true).children[0]; 
      let plr = clone.querySelector('.containerPlayer');
      let sc = clone.querySelector('.containerScore');

      plr.textContent = user.playerName;
      sc.textContent = user.score
      console.log(user.playerName);

  
  
  
      templateContainer.append(clone);
    })
};




const compare = (leaderboard, playerStats) => {
  if (playerStats.score > leaderboard[4].score) {
    leaderboard[4] = playerStats;
  }
  sortLeaderboard(leaderboard);
  changeHighscoreData(leaderboard);
}
const sortLeaderboard = (leaderboard) => {
  leaderboard.sort((a, b) => b.score - a.score);
  return leaderboard;
}

const updateHighscoreData = async (playerStats) => {
  try {
    const res = await fetch(dbURL);
    if (res.ok) {
      const data = await res.json();
      compare(sortLeaderboard(data), playerStats);
      changeHighscoreList(data);
    

      


    } else {
      throw new Error('Something went wrong')
    }
  } catch (err) {
    console.error(err)
  }
}

const changeHighscoreData = async (playerStats) => {
  let init = {
    method: 'PUT',
    body: JSON.stringify(playerStats),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  }
  try {
    const res = await fetch(dbURL, init);
    if (res.ok) {const data = await res.json()} else {throw new Error('Something went wrong')}
  } catch (err) {console.error(err)}
}

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    let playerNameDiv = document.getElementById('playerName');
    event.preventDefault();
    if (input.value.length > 0) {
      playerNameDiv.textContent = input.value;
    } else {
      playerNameDiv.textContent = "Anonymous";
    }
    console.log(playerNameDiv.value)
    // Gömma input field och button
    document.getElementById('divSetPlayerName').style.display = 'none';
  }
});
btn.addEventListener("click", function(event) {
  let playerNameDiv = document.getElementById('playerName');
  event.preventDefault();
  if (input.value.length > 0) {
    playerNameDiv.textContent = input.value;
  } else {
    playerNameDiv.textContent = "Anonymous";
  }
    // Gömma input field och button
    document.getElementById('divSetPlayerName').style.display = 'none';
});

  
function getPlayerName(){
  let name = document.getElementById('playerName');
    
  name = document.getElementById('playerNameInput').value;
  return name;
}
   
const game = () => {
    let pScore = 0;
    let cScore = 0;
  
    // Börja spelet
    const startGame = () => {
      const playBtn = document.querySelector(".intro button");
      const introScreen = document.querySelector(".intro");
      const match = document.querySelector(".match");
      let playerNameDiv = document.getElementById('playerName');
      playBtn.addEventListener("click", () => {
        if (input.value.length === 0) {
          playerNameDiv.innerHTML = "Anonymous";
        }
        introScreen.classList.add("fadeOut");
        match.classList.add("fadeIn");
      });
    };
    // Spela spelet
    const playMatch = () => {
      const options = document.querySelectorAll(".options button");
      const playerHand = document.querySelector(".player-hand");
      const computerHand = document.querySelector(".computer-hand");
      const hands = document.querySelectorAll(".hands img");
  
      hands.forEach(hand => {
        hand.addEventListener("animationend", function() {
          this.style.animation = "";
        });
      });
      // Datans options
      const computerOptions = ["rock", "paper", "scissors"];
  
      options.forEach(option => {
        option.addEventListener("click", function() {
          // Datans val
          const computerNumber = Math.floor(Math.random() * 3);
          const computerChoice = computerOptions[computerNumber];
  
          setTimeout(() => {
           
            compareHands(this.textContent, computerChoice);
            // uppdatera bilder
            playerHand.src = `./assets/${this.textContent}.png`;
            computerHand.src = `./assets/${computerChoice}.png`;
          }, 500);
          // animation
          playerHand.style.animation = "shakePlayer 0.5s ease";
          computerHand.style.animation = "shakeComputer 0.5s ease";
        });
      });
    };
  
    const updateScore = () => {
      const playerScore = document.querySelector(".player-score p");
      const computerScore = document.querySelector(".computer-score p");
      let playerNameDiv = document.getElementById('playerName');
      playerScore.textContent = pScore;
      computerScore.textContent = cScore;
      playerStats.score = pScore;
      playerStats.playerName = playerNameDiv.innerText;
      if (cScore === 1) {
        updateHighscoreData(playerStats);
        setTimeout(function () { location.reload(true); }, 1000);
      }
    };
  
    const compareHands = (playerChoice, computerChoice) => {

    const winner = document.querySelector(".winner");
    const player = getPlayerName();
      if (playerChoice === computerChoice) {
        winner.textContent = "It is a tie";
        return;
      }
      // kolla för Rock
      if (playerChoice === "rock") {
        if (computerChoice === "scissors") {
          winner.textContent = `${player} Wins`;
            pScore++;
          updateScore();
          return;
        } else {
          winner.textContent = "Computer Wins";
            cScore++;
          updateScore();
          return;
        }
      }
      // Kolla för Paper
      if (playerChoice === "paper") {
        if (computerChoice === "scissors") {
          winner.textContent = "Computer Wins";
          cScore++;
          updateScore();
          return;
        } else {
          winner.textContent = `${player} Wins`;
          pScore++;
          updateScore();
          return;
        }
      }
      // Kolla för Scissors
      if (playerChoice === "scissors") {
        if (computerChoice === "rock") {
          winner.textContent = "Computer Wins";
          cScore++;
          updateScore();
          return;
        } else {
          winner.textContent = `${player} Wins`;
          pScore++;
          updateScore();
          return;
        }
      }
    };
    
  
    //kalla alla inne funktioner
    startGame();
    playMatch();
  };
  
  //börja spelet funktionen
  game();
