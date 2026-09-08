from flask import Flask
import os
import sys

GENERATED_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "src", "app", "buf", "generated")
)
if GENERATED_DIR not in sys.path:
    sys.path.insert(0, GENERATED_DIR)

def create_app():
    app = Flask(__name__)


    from app.api.chat.controller import chat_controller

    app.register_blueprint(chat_controller)

    return app