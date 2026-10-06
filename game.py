from flask import Flask, render_template, request, jsonify
import torch
import random
from game_ai import playable_col, board_to_tensor, new_board
from dqn import DQN

app = Flask(__name__)
model = DQN()

def choose_col(board):
    valid = playable_col(board)
    with torch.no_grad():
        q_values = model(board_to_tensor(board, 2))
    best = valid[0]
    for c in valid:
        if q_values[c] > q_values[best]:
            best = c
    return best

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get-ai-move", methods=["POST"])
def get_ai_move():
    try:
        data = request.get_json()
        board_state = data.get("board")

        if not board_state:
            return jsonify({"error": "no board state provided"}), 400

        ai_choice = choose_col(board_state)
        return jsonify({"move": int(ai_choice)})
    except Exception as e:
        print("error during ai move generation:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)