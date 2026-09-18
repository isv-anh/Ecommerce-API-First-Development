import grpc

from app.buf.generated.order.v1 import order_pb2_grpc


class OrderClientManager:
    _instance: "OrderClientManager | None" = None
    _client: order_pb2_grpc.OrderServiceStub | None = None
    _channel: grpc.Channel | None = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def get_client(self, target: str = "localhost:50052") -> order_pb2_grpc.OrderServiceStub:
        if self._client is None:
            self._channel = grpc.insecure_channel(target)
            self._client = order_pb2_grpc.OrderServiceStub(self._channel)
        return self._client

    def close(self):
        if self._channel:
            self._channel.close()

order_client_manager = OrderClientManager()
