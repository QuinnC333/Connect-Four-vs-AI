import torch
import torch.nn as nn
import random
from collections import deque

from dqn import DQN
from game import new_board, drop_piece, playable_col, check_win, full_draw, board_to_tensor

model = DQN()
target = DQN()
target.load_state_dict(model.state_dict())

optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
loss_fn = nn.MSELoss()

buffer = deque(maxlen=10000)
gamma = 0.99
epsilon = 1.0
batch_size = 32


def choose_action(board, player, epsilon):
    valid = playable_col(board)
    
    if random.random() < epsilon:     #evaluation for randomness using epilson
        return random.choice(valid)     
    
    with torch.no_grad():            #feeds to dqn
        q_values = model(board_to_tensor (board, player))
    best = valid [0]
    for c in valid:
        if q_values [c] > q_values[best]:
            best = c
    return best

def play_round (epsilon): 
    board = new_board()
    player = 1
    moves = []

    while True:
        state = board_to_tensor (board, player)
        action = choose_action(board, player, epsilon)
        drop_piece (board, action, player)

        if check_win(board, player):
            moves.append ( (state, action, 1.0, None, True) ) #note reward +1.0
            if len(moves) >= 2:
                state, action, reward, next_state, done = moves[-2]
                moves[-2] = (state, action, -1.0, next_state, True)
            break

        if full_draw(board):
            moves.append((state, action, 0.0, None, True))
            break

        if player == 1:
            n_player = 2
        else:
            n_player = 1

        next_state = board_to_tensor(board, n_player)
        moves.append((state, action, 0.0, next_state, False))

        player = n_player

    for item in moves:
        buffer.append(item)



def learn():
    if len(buffer) < batch_size: #set at 32 samples to train
        return

    batch = random.sample(buffer, batch_size)

    for state, action, reward, next_state, done in batch:
        q_values = model(state)
        prediction = q_values[action]

        if done:
            target_value = reward
        else:
            with torch.no_grad():
                next_q = target(next_state)
            target_value = reward + gamma * next_q.max().item()

        loss = loss_fn(prediction, torch.tensor(target_value))

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

epsilon = 1.0
wins = 0

for episode in range(2000):
    play_round(epsilon)
    learn()

    if epsilon > 0.05:
        epsilon = epsilon * 0.999

    if episode % 100 == 0:
        print(f"episode {episode}, epsilon {epsilon:.3f}, buffer {len(buffer)}")

    if episode % 200 == 0:
        target.load_state_dict(model.state_dict())

torch.save(model.state_dict(), "model.pth")
print("done, saved model.pth")