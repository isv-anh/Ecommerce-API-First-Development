import os
import sys
import grpc
from concurrent import futures
import app.buf.generated.ai_assistant.v1.ai_assistant_pb2_grpc as pb2_grpc
from app.api.chat.servicer import ChatServicer

GENERATED_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "buf", "generated")
)
if GENERATED_DIR not in sys.path:
    sys.path.insert(0, GENERATED_DIR)

def create_server():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    pb2_grpc.add_ChatServiceServicer_to_server(ChatServicer(), server)
    return server