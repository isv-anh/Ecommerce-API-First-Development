import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY", "")
    DEFAULT_MODEL = "qwen-plus"
    TEMPERATURE = 0.0

settings = Settings()