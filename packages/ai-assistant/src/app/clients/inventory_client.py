import os

import grpc

from app.buf.generated.product.v1 import product_pb2_grpc


class InventoryClientManager:
    _instance: "InventoryClientManager | None" = None
    _client: product_pb2_grpc.InventoryServiceStub | None = None
    _channel: grpc.Channel | None = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def get_client(
        self, target: str | None = None
    ) -> product_pb2_grpc.InventoryServiceStub:
        if self._client is None:
            self._channel = grpc.insecure_channel(target or os.getenv("INVENTORY_SERVICE_URL", "localhost:50051"))
            self._client = product_pb2_grpc.InventoryServiceStub(self._channel)
        return self._client

    def close(self):
        if self._channel:
            self._channel.close()

inventory_client_manager = InventoryClientManager()
