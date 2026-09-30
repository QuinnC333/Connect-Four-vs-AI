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
}
            
function dropPlayer(col){
    if(isPlayerTurn){
        if(col>=0 && col<=6){
            for(let i=5;i>=0;i--){
                if(board[i][col]==0){
                    board[i][col]=1;
                    break;
                }
            }
        }
        isPlayerTurn = false;
        console.log(board);
        load();
        if(isWin(1)){
            winAnimation(2);
            return;
        }
        aiTurn();
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
            winAnimation(2);
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

function inBoundsX(...nums){
    for(let i = 0;i<nums.length;i++){
        if(nums[i]<0 || nums[i]>6){
            return false;
        }
    }
    return true;
}

function inBoundsY(...nums){
    for(let i = 0;i<nums.length;i++){
        if(nums[i]<0 || nums[i]>5){
            return false;
        }
    }
    return true;
}

function isWin(curPlayer){
    for(let r = 0;r <= 5;r++){
        for(let c = 0;c <= 6;c++){
            if(board[r][c] == curPlayer){
                //horizontal bkw
                if(inBoundsX(c,c-1,c-2,c-3)){
                    if(board[r][c-1] == curPlayer && board[r][c-2] == curPlayer && board[r][c-3] == curPlayer){
                        console.log("Player " + curPlayer + " wins!");
                        return true;
                    }
                //horizontal frwd
                }else if(inBoundsX(c,c+1,c+2,c+3)){

                }
            }
        }
    }
    return false;
}

function winAnimation(player){
    //this
}

const startTop = 26;
const cellSize = 80;
const spacing = 9;
function getRowTop(row){
    return startTop + row * (cellSize + spacing);
}