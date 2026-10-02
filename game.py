from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get-ai-move", methods=["POST"])
def get_ai_move():
    data = request.get_json()
    board_state = data.get("board")

    #CHANGE THIS TO UR AI ↓
    ai_choice = random.randint(0, 6)

    return jsonify({"move": ai_choice})

if __name__ == "__main__":
    app.run(debug=True)