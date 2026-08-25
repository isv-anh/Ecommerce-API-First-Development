from flask import Flask

def create_app():
    app = Flask(__name__)


    from app.api.chat.controller import chat_controller

    app.register_blueprint(chat_controller)

    return app