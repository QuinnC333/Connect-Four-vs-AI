import torch


ROWS, COLS = 6, 7
def new_board():
    return [[0] * COLS for _ in range(ROWS)]

#evaluates for an empty slot
def drop_piece(board, col, player):
    for row in range(ROWS - 1, -1, -1):
        if board[row][col] == 0:
            board[row][col] = player
            return row
    return None

def check_win(board, player):
    # horizontal
    for r in range(ROWS):
        for c in range(COLS - 3):
            if board[r][c] == player and board[r][c+1] == player and board[r][c+2] == player and board[r][c+3] == player:
                return True

    # vertical
    for r in range(ROWS - 3):
        for c in range(COLS):
            if board[r][c] == player and board[r+1][c] == player and board[r+2][c] == player and board[r+3][c] == player:
                return True

    # diagonal down-right
    for r in range(ROWS - 3):
        for c in range(COLS - 3):
            if board[r][c] == player and board[r+1][c+1] == player and board[r+2][c+2] == player and board[r+3][c+3] == player:
                return True

    # diagonal up-right
    for r in range(3, ROWS):
        for c in range(COLS - 3):
            if board[r][c] == player and board[r-1][c+1] == player and board[r-2][c+2] == player and board[r-3][c+3] == player:
                return True

    return False

#what columns are avaliable
def playable_col (board):
    return [c for c in range(COLS) if board[0][c] == 0]

#if spaces are left
def full_draw(board):
    return len(playable_col(board)) == 0 #length of columns left

def board_to_tensor(board, player):
    squares = []
    for row in board:
        for cell in row:
            if cell == 0:
                squares.append(0.0)
            elif cell == player:
                squares.append(1.0)
            else:
                squares.append(-1.0)
    return torch.tensor(squares)
