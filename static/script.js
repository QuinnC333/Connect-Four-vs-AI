let isPlayerTurn = true;
let ai_col = null;
let win = 0;
let board;
            
const colPos = [70,166,259,354,448,542,636];

document.addEventListener("DOMContentLoaded", () => {
    game();
});

function game(){
    reset();
}
            
function reset(){
    board = [[0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0]];
    load();
    isPlayerTurn = true;
    document.getElementById("winMsg").style.display = "none";
    document.querySelector(".semi-transparent-box").style.display = "none";
}
            
function dropPlayer(col){
    if(isPlayerTurn){
        if(col>=0 && col<=6 && (board[0][col]==0)){
            for(let i=5;i>=0;i--){
                if(board[i][col]==0){
                    board[i][col]=1;
                    break;
                }
            }
        }
        console.log(board);
        load();
        if(board[0][col]==0){
            isPlayerTurn = false;
            if(isWin(1)){
                return;
            }
            aiTurn();
        }
    }
}

async function fetchAI(board) {
    try {
        let response = await fetch("/get-ai-move", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ board: board })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        return data.move;
    } catch (error) {
        console.error("Error getting AI move:", error);
    }
}

async function aiTurn(){
    ai_col = await fetchAI(board);
    if((ai_col!=null) && (!isPlayerTurn)){
        if(ai_col>=0 && ai_col<=6){
            for(let i=5;i>=0;i--){
                if(board[i][ai_col]==0){
                    board[i][ai_col]=2;
                    break;
                }
            }
        }
        console.log(board);
        load();
        if(isWin(2)){
            return;
        }
        isPlayerTurn = true;
    }
}

function load(){
    const container = document.getElementById("pieces");
    container.innerHTML = "";

    for(let i=5;i>=0;i--){
        for(let j=0;j<7;j++){
            if(board[i][j]==1){
                let newDiv = document.createElement("div");
                newDiv.classList.add("playerPiece");
                newDiv.style.top = getRowTop(i) + "px";
                newDiv.style.left = colPos[j] + "px";
                container.appendChild(newDiv);
            }else if(board[i][j]==2){
                let newDiv = document.createElement("div");
                newDiv.classList.add("aiPiece");
                newDiv.style.top = getRowTop(i) + "px";
                newDiv.style.left = colPos[j] + "px";
                container.appendChild(newDiv);
            }else{}
        }
    }
}

function isFullBoard(){
    for(let r = 0; r<=5;r++){
        for(let c = 0;c<=6;c++){
            if(board[r][c]==0){
                return false;
            }
        }
    }
    return true;
}

function isWin(curPlayer) {
    const directions = [
        [0, 1], //right
        [1, 0], //down
        [1, 1], //down right
        [1, -1] //down left
    ];

    for(let r = 0;r <= 5;r++){
        for(let c = 0;c <= 6;c++) {
            if(board[r][c] != curPlayer)continue;
            for (let [dr,dc] of directions) {
                let win = true;
                for (let i = 1; i < 4; i++) {
                    let nr = r + dr * i;
                    let nc = c + dc * i;
                    if (nr < 0 || nr > 5 || nc < 0 || nc > 6 || board[nr][nc] !== curPlayer){
                        win = false;
                        break;
                    }
                }
                if (win){
                    console.log("Player " + curPlayer + " wins!");
                    setTimeout(() => winAnimation(curPlayer), 50);
                    return true;
                }
            }
        }
    }
    return false;
}

function winAnimation(player){
    message = document.getElementById("winMsg");
    box = document.querySelector(".semi-transparent-box");
    if(!message || !box){
        console.error("item does not exist")
    }
    if(player == 1){
        message.textContent = "Player wins!";
        console.log("message");
    }else{
        message.textContent = "AI wins!";
    }
    box.style.display = "flex";
    message.style.display = "block";
}

const startTop = 26;
const cellSize = 80;
const spacing = 9;
function getRowTop(row){
    return startTop + row * (cellSize + spacing);
}