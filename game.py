from flask import Flask, render_template, request, jsonify
import torch
import random
from game_ai import playable_col, board_to_tensor, new_board
from dqn import DQN

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get-ai-move", methods=["POST"])
def get_ai_move():
    data = request.get_json()
    board_state = data.get("board")

    ai_choice = random.randint(0,6);
    #ai_choice = choose_col(board_state);

    return jsonify({"move": ai_choice})

if __name__ == "__main__":
    app.run(debug=True)