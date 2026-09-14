import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "src"))

from app import create_server
import time

def serve():
    server = create_server()
    server.add_insecure_port('[::]:50051')
    server.start()
    print("gRPC Server started on port 50051...")
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == "__main__":
    serve()